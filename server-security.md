# Server Security Configuration for The Spirit Nerds

This document provides guidance on securing your production environment for The Spirit Nerds application, with particular focus on protection against DoS/DDoS attacks and other common web vulnerabilities.

## DoS/DDoS Protection Measures

### 1. Use a CDN with DDoS Protection

Implement a Content Delivery Network (CDN) with built-in DDoS protection:

- **Cloudflare**: Offers free and paid plans with DDoS mitigation
- **AWS CloudFront + Shield**: AWS's CDN with DDoS protection
- **Akamai**: Enterprise-level protection
- **Fastly**: Another enterprise option with good DDoS protection

### 2. Rate Limiting

Implement rate limiting at the server level:

#### Nginx Configuration Example:

```nginx
http {
    # Define a zone for rate limiting
    limit_req_zone $binary_remote_addr zone=mylimit:10m rate=10r/s;
    
    server {
        # Apply rate limiting to all requests
        limit_req zone=mylimit burst=20 nodelay;
        
        # Other server configurations...
    }
}
```

#### Express.js Rate Limiting Example:

```javascript
const rateLimit = require('express-rate-limit');

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later'
});

// Apply to all requests
app.use(apiLimiter);
```

### 3. Configure Timeouts

Set appropriate timeouts to prevent slow HTTP attacks:

#### Nginx Example:

```nginx
http {
    client_body_timeout 10s;
    client_header_timeout 10s;
    keepalive_timeout 65s;
    send_timeout 10s;
    
    # Other configurations...
}
```

### 4. Set Up Resource Limits

Limit the resources each connection can consume:

#### Nginx Example:

```nginx
http {
    # Max request body size
    client_max_body_size 10M;
    
    # Limit buffer sizes
    client_body_buffer_size 128k;
    client_header_buffer_size 1k;
    large_client_header_buffers 4 4k;
    
    # Other configurations...
}
```

## HTTP Security Headers

Ensure these security headers are set on your server:

```nginx
add_header X-Content-Type-Options "nosniff" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header X-Frame-Options "DENY" always;
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;
add_header Referrer-Policy "no-referrer-when-downgrade" always;
add_header Permissions-Policy "camera=(), microphone=(), geolocation=()";
add_header Content-Security-Policy "default-src 'self'; script-src 'self' https://pagead2.googlesyndication.com https://www.google-analytics.com 'unsafe-inline'; style-src 'self' https://fonts.googleapis.com 'unsafe-inline'; img-src 'self' data: https: blob:; font-src 'self' https://fonts.gstatic.com; connect-src 'self' https://www.google-analytics.com; frame-ancestors 'none'; block-all-mixed-content; upgrade-insecure-requests" always;
```

## Firewall Configuration

### 1. Set Up Web Application Firewall (WAF)

Consider implementing a WAF to protect against common web attacks:

- **ModSecurity**: Open-source WAF for Apache, Nginx
- **AWS WAF**: For AWS deployments
- **Cloudflare WAF**: Included with Cloudflare plans

### 2. Configure Server Firewall

Limit open ports to only those necessary:

```bash
# Allow HTTP, HTTPS
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Allow SSH (preferably on a non-standard port)
sudo ufw allow 2222/tcp

# Enable the firewall
sudo ufw enable
```

## SSL/TLS Configuration

### Secure SSL/TLS Settings

```nginx
ssl_protocols TLSv1.2 TLSv1.3;
ssl_prefer_server_ciphers on;
ssl_ciphers 'ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305:ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256';
ssl_session_cache shared:SSL:10m;
ssl_session_timeout 10m;
ssl_session_tickets off;
ssl_stapling on;
ssl_stapling_verify on;
```

## Additional Server Hardening

### 1. Keep Software Updated

Regularly update:
- Operating system
- Web server software (Nginx, Apache)
- Runtime environments (Node.js, etc.)
- Dependencies and libraries

### 2. Implement Monitoring and Logging

Set up logging and monitoring to detect attacks:

- **ELK Stack**: For log collection and analysis
- **Prometheus + Grafana**: For monitoring
- **Fail2ban**: To automatically block suspicious IPs

### 3. Set Up Redundancy

- Use load balancers to distribute traffic
- Implement auto-scaling to handle traffic spikes
- Have backup servers ready

## Regular Security Testing

- Perform regular security scans
- Consider penetration testing
- Run vulnerability assessments

## Specific to SPA/React Applications

1. Implement proper CORS headers:
```
Access-Control-Allow-Origin: https://yourdomain.com
Access-Control-Allow-Methods: GET, POST, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization
```

2. Set up proper caching for static assets:
```
Cache-Control: public, max-age=86400
```

---

By implementing these security measures, you'll significantly improve your application's resilience against DoS/DDoS attacks and other common web vulnerabilities. 