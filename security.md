# Security Policy

## Reporting a Vulnerability

If you discover a security vulnerability in NetLab, please do not create a public GitHub issue containing sensitive security details.

Instead, report the vulnerability privately to the project maintainer.

Please include:

- A description of the vulnerability
- Steps to reproduce it
- The potential impact
- Any relevant screenshots, logs, or proof of concept

## Security Considerations

NetLab uses:

- Password hashing with bcrypt
- JWT-based authentication
- HttpOnly cookies for authentication tokens
- Short-lived access tokens
- Refresh-token rotation
- MongoDB/Mongoose for data persistence

Never include passwords, JWT secrets, refresh tokens, database credentials, or `.env` contents in bug reports.

## Supported Versions

Security fixes are applied to the latest version of the project.