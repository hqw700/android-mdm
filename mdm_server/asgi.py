import os

import django
from channels.routing import ProtocolTypeRouter, URLRouter
from django.core.asgi import get_asgi_application
import devices.routing

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'mdm_server.settings')
django.setup()

application = ProtocolTypeRouter({
  "http": get_asgi_application(),
  "websocket": URLRouter(
        devices.routing.websocket_urlpatterns
    ),
})
