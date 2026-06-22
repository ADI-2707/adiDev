import time
from fastapi import Request, HTTPException, status

class InMemoryRateLimiter:
    def __init__(self, max_requests: int, window_seconds: int):
        self.max_requests = max_requests
        self.window_seconds = window_seconds
        self.requests = {}  # ip -> list of timestamps

    async def __call__(self, request: Request):
        ip = request.client.host if request.client else "unknown"
        now = time.time()
        
        # Clean up old timestamps
        if ip in self.requests:
            self.requests[ip] = [t for t in self.requests[ip] if now - t < self.window_seconds]
        else:
            self.requests[ip] = []
            
        if len(self.requests[ip]) >= self.max_requests:
            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail=f"Rate limit exceeded. Max {self.max_requests} requests per window."
            )
            
        self.requests[ip].append(now)

# Limiters
contact_rate_limiter = InMemoryRateLimiter(max_requests=3, window_seconds=3600)
testimonial_rate_limiter = InMemoryRateLimiter(max_requests=5, window_seconds=3600)
