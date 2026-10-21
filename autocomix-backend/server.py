"""
AutoComix Backend Server for NekkoReader
Integra o motor de detecção de painéis do AutoComix com o NekkoReader via API HTTP
"""

from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import os
import sys
import json
import base64
import tempfile
from pathlib import Path
from PIL import Image
import io

# Adiciona o caminho do AutoComix ao sys.path
AUTOCOMIX_PATH = os.environ.get('AUTOCOMIX_PATH', r'C:\AutoComix')
if os.path.exists(AUTOCOMIX_PATH):
    sys.path.insert(0, AUTOCOMIX_PATH)

app = Flask(__name__)
CORS(app)

# Cache de detecções
detection_cache = {}

@app.route('/health', methods=['GET'])
def health():
    """Verifica se o servidor está rodando"""
    return jsonify({
        'status': 'ok',
        'autocomix_available': check_autocomix(),
        'version': '1.0.0'
    })

def check_autocomix():
    """Verifica se o AutoComix está disponível"""
    try:
        import autocomix
        return True
    except ImportError:
        return False

@app.route('/detect-panels', methods=['POST'])
def detect_panels():
    """
    Detecta painéis em uma imagem usando o motor do AutoComix
    
    Request:
    {
        "image_base64": "...",
        "use_gpu": true,
        "confidence_threshold": 0.5
    }
    
    Response:
    {
        "panels": [
            {"x": 10, "y": 20, "width": 100, "height": 150, "confidence": 0.95},
            ...
        ],
        "processing_time": 0.5
    }
    """
    try:
        data = request.json
        image_base64 = data.get('image_base64')
        use_gpu = data.get('use_gpu', True)
        confidence_threshold = data.get('confidence_threshold', 0.5)
        
        if not image_base64:
            return jsonify({'error': 'image_base64 is required'}), 400
        
        # Decodifica a imagem
        image_data = base64.b64decode(image_base64)
        image = Image.open(io.BytesIO(image_data))
        
        # Salva temporariamente
        with tempfile.NamedTemporaryFile(suffix='.png', delete=False) as tmp:
            image.save(tmp.name)
            tmp_path = tmp.name
        
        try:
            # Detecta painéis usando AutoComix
            panels = detect_panels_autocomix(tmp_path, use_gpu, confidence_threshold)
            
            return jsonify({
                'panels': panels,
                'processing_time': 0.5,  # Placeholder
                'image_size': {'width': image.width, 'height': image.height}
            })
        finally:
            # Remove arquivo temporário
            os.unlink(tmp_path)
            
    except Exception as e:
        return jsonify({'error': str(e)}), 500

def detect_panels_autocomix(image_path, use_gpu=True, confidence_threshold=0.5):
    """
    Usa o motor do AutoComix para detectar painéis
    """
    if not check_autocomix():
        # Fallback: detecção simples baseada em bordas
        return detect_panels_simple(image_path)
    
    try:
        # Importa módulos do AutoComix
        from autocomix import detect_panels as ac_detect
        
        # Detecta painéis
        panels_raw = ac_detect(image_path, use_gpu=use_gpu)
        
        # Filtra por confiança
        panels = []
        for panel in panels_raw:
            if panel.get('confidence', 0) >= confidence_threshold:
                panels.append({
                    'x': panel['x'],
                    'y': panel['y'],
                    'width': panel['width'],
                    'height': panel['height'],
                    'confidence': panel.get('confidence', 0)
                })
        
        return panels
        
    except Exception as e:
        print(f"Erro ao usar AutoComix: {e}")
        # Fallback para detecção simples
        return detect_panels_simple(image_path)

def detect_panels_simple(image_path):
    """
    Detecção simples de painéis usando OpenCV (fallback)
    """
    try:
        import cv2
        import numpy as np
        
        # Lê a imagem
        img = cv2.imread(image_path)
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        
        # Detecta bordas
        edges = cv2.Canny(gray, 50, 150)
        
        # Encontra contornos
        contours, _ = cv2.findContours(edges, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
        
        # Filtra contornos grandes (prováveis painéis)
        panels = []
        img_height, img_width = gray.shape
        
        for contour in contours:
            x, y, w, h = cv2.boundingRect(contour)
            
            # Filtra por tamanho mínimo
            if w > img_width * 0.1 and h > img_height * 0.1:
                panels.append({
                    'x': int(x),
                    'y': int(y),
                    'width': int(w),
                    'height': int(h),
                    'confidence': 0.7
                })
        
        return panels
        
    except ImportError:
        # OpenCV não disponível, retorna lista vazia
        return []
    except Exception as e:
        print(f"Erro na detecção simples: {e}")
        return []

@app.route('/process-book', methods=['POST'])
def process_book():
    """
    Processa um arquivo de quadrinhos completo
    
    Request:
    {
        "file_path": "/path/to/comic.cbz",
        "use_gpu": true
    }
    
    Response:
    {
        "pages": [
            {
                "page_number": 1,
                "panels": [...],
                "image_base64": "..."
            },
            ...
        ]
    }
    """
    try:
        data = request.json
        file_path = data.get('file_path')
        use_gpu = data.get('use_gpu', True)
        
        if not file_path or not os.path.exists(file_path):
            return jsonify({'error': 'file_path is required and must exist'}), 400
        
        # Extrai páginas do arquivo
        pages = extract_book_pages(file_path)
        
        # Detecta painéis em cada página
        for page in pages:
            page['panels'] = detect_panels_autocomix(page['temp_path'], use_gpu)
            # Remove caminho temporário
            if 'temp_path' in page:
                del page['temp_path']
        
        return jsonify({
            'pages': pages,
            'total_pages': len(pages)
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

def extract_book_pages(file_path):
    """
    Extrai páginas de um arquivo de quadrinhos
    """
    import zipfile
    import rarfile
    
    pages = []
    ext = Path(file_path).suffix.lower()
    
    if ext in ['.cbz', '.zip']:
        with zipfile.ZipFile(file_path, 'r') as zip_ref:
            # Filtra apenas imagens
            image_files = sorted([
                f for f in zip_ref.namelist()
                if f.lower().endswith(('.jpg', '.jpeg', '.png', '.gif', '.webp'))
            ])
            
            for i, img_file in enumerate(image_files):
                img_data = zip_ref.read(img_file)
                img_base64 = base64.b64encode(img_data).decode('utf-8')
                
                # Salva temporariamente para detecção
                with tempfile.NamedTemporaryFile(suffix='.png', delete=False) as tmp:
                    tmp.write(img_data)
                    tmp_path = tmp.name
                
                pages.append({
                    'page_number': i + 1,
                    'file_name': img_file,
                    'image_base64': img_base64,
                    'temp_path': tmp_path
                })
    
    elif ext in ['.cbr', '.rar']:
        with rarfile.RarFile(file_path, 'r') as rar_ref:
            image_files = sorted([
                f for f in rar_ref.namelist()
                if f.lower().endswith(('.jpg', '.jpeg', '.png', '.gif', '.webp'))
            ])
            
            for i, img_file in enumerate(image_files):
                img_data = rar_ref.read(img_file)
                img_base64 = base64.b64encode(img_data).decode('utf-8')
                
                with tempfile.NamedTemporaryFile(suffix='.png', delete=False) as tmp:
                    tmp.write(img_data)
                    tmp_path = tmp.name
                
                pages.append({
                    'page_number': i + 1,
                    'file_name': img_file,
                    'image_base64': img_base64,
                    'temp_path': tmp_path
                })
    
    return pages

@app.route('/auto-rotate', methods=['POST'])
def auto_rotate():
    """
    Determina se um painel deve ser rotacionado
    
    Request:
    {
        "panel": {"x": 10, "y": 20, "width": 100, "height": 150},
        "screen_aspect_ratio": 1.78,
        "threshold": 1.3
    }
    
    Response:
    {
        "should_rotate": true,
        "rotation_angle": 90,
        "improvement_factor": 1.5
    }
    """
    try:
        data = request.json
        panel = data.get('panel')
        screen_aspect_ratio = data.get('screen_aspect_ratio', 1.78)
        threshold = data.get('threshold', 1.3)
        
        if not panel:
            return jsonify({'error': 'panel is required'}), 400
        
        # Calcula aspect ratio do painel
        panel_aspect = panel['width'] / panel['height']
        
        # Determina se deve rotacionar
        current_fill = min(panel_aspect / screen_aspect_ratio, screen_aspect_ratio / panel_aspect)
        rotated_fill = min((1/panel_aspect) / screen_aspect_ratio, screen_aspect_ratio / (1/panel_aspect))
        
        improvement = rotated_fill / current_fill if current_fill > 0 else 1
        
        should_rotate = improvement >= threshold
        rotation_angle = 90 if should_rotate else 0
        
        return jsonify({
            'should_rotate': should_rotate,
            'rotation_angle': rotation_angle,
            'improvement_factor': improvement
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    print("=" * 60)
    print("AutoComix Backend Server for NekkoReader")
    print("=" * 60)
    print(f"AutoComix path: {AUTOCOMIX_PATH}")
    print(f"AutoComix available: {check_autocomix()}")
    print("=" * 60)
    print("Starting server on http://localhost:5000")
    print("=" * 60)
    
    app.run(host='0.0.0.0', port=5000, debug=True)
