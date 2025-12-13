# HAMROpdf - Django Backend

A powerful PDF manipulation API built with Django REST Framework. This replaces the Node.js/Express backend with optimized Python-based PDF processing.

## 📁 Project Structure

```
hamropdf_backend/
├── manage.py                 # Django management script
├── requirements.txt          # Python dependencies
├── .env.example             # Environment variables template
├── .env                     # Your local environment (create from .env.example)
│
├── core/                    # Django project settings
│   ├── __init__.py
│   ├── settings.py          # Main settings
│   ├── urls.py              # Root URL configuration
│   ├── wsgi.py              # WSGI application
│   ├── asgi.py              # ASGI application
│   └── exceptions.py        # Custom exception handler
│
├── apps/                    # Django applications
│   ├── __init__.py
│   │
│   ├── users/               # User authentication & management
│   │   ├── models.py        # User model
│   │   ├── views.py         # Auth views (login, register, OAuth)
│   │   ├── serializers.py   # DRF serializers
│   │   ├── permissions.py   # Custom permissions
│   │   ├── urls.py          # URL routes
│   │   └── admin.py         # Admin configuration
│   │
│   ├── pdf_tools/           # PDF manipulation tools
│   │   ├── models.py        # Operation tracking
│   │   ├── views.py         # All PDF tool endpoints
│   │   ├── services.py      # Core PDF processing logic
│   │   ├── excel_service.py # PDF to Excel conversion
│   │   ├── conversion_service.py  # Document conversions
│   │   └── urls.py          # URL routes
│   │
│   ├── files/               # File upload/management
│   │   ├── models.py
│   │   ├── views.py
│   │   ├── serializers.py
│   │   └── urls.py
│   │
│   ├── signatures/          # Digital signatures
│   │   ├── models.py
│   │   ├── views.py
│   │   ├── serializers.py
│   │   └── urls.py
│   │
│   ├── ads/                 # Advertisement management
│   │   ├── models.py
│   │   ├── views.py
│   │   ├── serializers.py
│   │   └── urls.py
│   │
│   └── splash/              # Splash screens
│       ├── models.py
│       ├── views.py
│       ├── serializers.py
│       └── urls.py
│
├── uploads/                 # User uploads directory
├── temp/                    # Temporary processing files
├── logs/                    # Application logs
└── staticfiles/            # Collected static files
```

## 🚀 Quick Start

### 1. Prerequisites

- Python 3.10+
- MySQL 8.0+
- System dependencies for PDF processing

### 2. Install System Dependencies

```bash
# Ubuntu/Debian
sudo apt update
sudo apt install -y \
    python3-pip python3-venv \
    libmysqlclient-dev \
    poppler-utils \
    qpdf \
    ghostscript \
    libreoffice \
    tesseract-ocr \
    libmagic1

# macOS
brew install mysql poppler qpdf ghostscript libreoffice tesseract libmagic
```

### 3. Setup Project

```bash
# Clone/copy the project
cd hamropdf_backend

# Create virtual environment
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install Python dependencies
pip install -r requirements.txt

# Create .env file
cp .env.example .env
# Edit .env with your settings
```

### 4. Setup Database

```sql
-- Login to MySQL
mysql -u root -p

-- Create database
CREATE DATABASE hamropdf CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Create user (optional)
CREATE USER 'hamropdf_user'@'localhost' IDENTIFIED BY 'your_password';
GRANT ALL PRIVILEGES ON hamropdf.* TO 'hamropdf_user'@'localhost';
FLUSH PRIVILEGES;
```

### 5. Run Migrations

```bash
# Apply database migrations
python manage.py makemigrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser
```

### 6. Start Development Server

```bash
python manage.py runserver
```

The API will be available at: `http://localhost:8000`

## 📡 API Endpoints

### Authentication (`/api/auth/`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/register/` | Register new user |
| POST | `/login/` | Login user |
| GET | `/me/` | Get current user |
| POST | `/change-password/` | Change password |
| GET | `/google/` | Google OAuth login |
| GET | `/users/` | List all users (admin) |
| GET | `/users/<id>/` | Get user by ID |
| PUT | `/users/<id>/` | Update user |
| DELETE | `/users/<id>/` | Delete user (admin) |

### PDF Tools (`/api/pdf/`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/merge/` | Merge multiple PDFs |
| POST | `/split/` | Split PDF into pages |
| POST | `/compress/` | Compress PDF |
| POST | `/protect/` | Add password protection |
| POST | `/unlock/` | Remove password |
| POST | `/rotate/` | Rotate pages |
| POST | `/organize/` | Reorder pages |
| POST | `/watermark/` | Add watermark |
| POST | `/pdf-to-jpg/` | Convert to images |
| POST | `/jpg-to-pdf/` | Convert images to PDF |
| POST | `/pdf-to-word/` | Convert to Word |
| POST | `/word-to-pdf/` | Convert Word to PDF |
| POST | `/pdf-to-ppt/` | Convert to PowerPoint |
| POST | `/ppt-to-pdf/` | Convert PPT to PDF |
| POST | `/excel-to-pdf/` | Convert Excel to PDF |
| POST | `/analyze/` | Analyze PDF for Excel |
| POST | `/generate/` | Generate Excel |
| POST | `/page-numbers/` | Add page numbers |
| POST | `/sign/` | Add signature |
| POST | `/repair/` | Repair PDF |
| POST | `/pdf-a/` | Convert to PDF/A |
| POST | `/info/` | Get PDF information |
| GET | `/test/` | API health check |

### Files (`/api/files/`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/upload/` | Upload file |
| GET | `/user/<user_id>/` | Get user's files |
| GET | `/download/<file_id>/` | Download file |
| GET | `/view/<file_id>/` | View/stream file |
| PUT | `/<file_id>/` | Update file |
| DELETE | `/<file_id>/` | Delete file |

### Signatures (`/api/signatures/`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET/POST | `/` | List/create signatures |
| GET | `/default/` | Get default signature |
| GET/PUT/DELETE | `/<id>/` | Manage signature |
| POST | `/<id>/set-default/` | Set as default |
| POST | `/upload/` | Upload signature image |

### Ads (`/api/ads/`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/placement/<placement>/` | Get active ad |
| POST | `/<id>/impression/` | Track impression |
| POST | `/<id>/click/` | Track click |
| GET/POST | `/` | List/create ads (admin) |
| GET/PUT/DELETE | `/<id>/` | Manage ad (admin) |
| GET | `/<id>/stats/` | Get ad stats (admin) |

### Splash (`/api/splash/`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/active/` | Get active splash screens |
| GET/POST | `/` | List/create (admin) |
| GET/PUT/DELETE | `/<id>/` | Manage splash |
| PATCH | `/<id>/toggle-status/` | Toggle status |
| GET | `/admin/stats/` | Get statistics |

## 🔧 Frontend Integration

Update your React frontend API calls to use the new Django endpoints.

### Before (Express):
```javascript
const response = await fetch('http://localhost:5000/api/pdf/merge', {
  method: 'POST',
  body: formData
});
```

### After (Django):
```javascript
const response = await fetch('http://localhost:8000/api/pdf/merge/', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`  // If required
  },
  body: formData
});
```

### Key Differences:
1. **Trailing slashes**: Django URLs require trailing slashes
2. **Port**: Default Django port is 8000 (Express was 5000)
3. **Auth header**: Use `Bearer` token format

## 🚀 Production Deployment

### Using Gunicorn

```bash
pip install gunicorn

# Run with Gunicorn
gunicorn core.wsgi:application --bind 0.0.0.0:8000 --workers 4
```

### Using Docker

```dockerfile
FROM python:3.11-slim

# Install system dependencies
RUN apt-get update && apt-get install -y \
    libmysqlclient-dev poppler-utils qpdf ghostscript \
    libreoffice tesseract-ocr libmagic1 \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

RUN python manage.py collectstatic --noinput

EXPOSE 8000
CMD ["gunicorn", "core.wsgi:application", "--bind", "0.0.0.0:8000", "--workers", "4"]
```

### Nginx Configuration

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location /static/ {
        alias /path/to/hamropdf_backend/staticfiles/;
    }

    location /uploads/ {
        alias /path/to/hamropdf_backend/uploads/;
    }

    location / {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        client_max_body_size 50M;
    }
}
```

## 📝 License

MIT License
