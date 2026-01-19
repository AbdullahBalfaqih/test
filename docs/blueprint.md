# **App Name**: Fyaa: Secure File Middleware

## Core Features:

- File Upload via Widget: React widget with drag-and-drop functionality for file uploads.
- Intelligent Compression: Automatically compress files larger than 1MB (images/PDFs) using Python and Celery before storing them in S3. A tool decides if compression will occur based on filesize.
- Secure Cloud Storage: Store files in an S3-compatible cloud storage with end-to-end encryption.
- File Tokenization: Generate and return a unique file_token to the frontend for each uploaded file.
- Beneficiary Uploader Component: React component with drag & drop, progress bars, and success states for end-user uploads.
- Provider Viewer Component: Accordion-style list of attachments with lazy-loaded files upon expansion, and pre-signed URLs for inline document viewing.
- Metadata Management: Store file metadata (file_id, original_name, size, mime_type, storage_key) in a PostgreSQL database.

## Style Guidelines:

- Primary color: Deep indigo (#3F51B5) to evoke trust and security.
- Background color: Light lavender (#E8EAF6) for a soft and clean interface.
- Accent color: Electric purple (#7C4DFF) for interactive elements and highlights.
- Body and headline font: 'Inter', a grotesque-style sans-serif, providing a modern, machined look suitable for headlines or body text.
- Use simple, outline-style icons to represent file types and actions.
- Accordion/Layered design for the Provider View to conserve bandwidth.
- Smooth transitions and loading animations for a seamless user experience.