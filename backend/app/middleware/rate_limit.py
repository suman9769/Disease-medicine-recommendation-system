"""Rate limiting middleware"""

from fastapi import Request, HTTPException
from starlette.middleware.base import BaseHTTPMiddleware
import time
from collections import defaultdict, deque
import logging

logger = logging.getLogger(__name__)

class RateLimitMiddleware(BaseHTTPMiddleware):
    """Rate limiting middleware"""
    
    def __init__(self, app, calls: int = 100, period: int = 60):
        super().__init__(app)
        self.calls = calls
        self.period = period
        self.clients = defaultdict(deque)
    
    async def dispatch(self, request: Request, call_next):
        # Get client IP
        client_ip = request.client.host
        
        # Clean old requests
        now = time.time()
        client_requests = self.clients[client_ip]
        
        # Remove requests older than the period
        while client_requests and client_requests[0] <= now - self.period:
            client_requests.popleft()
        
        # Check rate limit
        if len(client_requests) >= self.calls:
            logger.warning(f"Rate limit exceeded for {client_ip}")
            raise HTTPException(
                status_code=429,
                detail="Rate limit exceeded. Please try again later."
            )
        
        # Add current request
        client_requests.append(now)
        
        # Process request
        response = await call_next(request)
        return response
