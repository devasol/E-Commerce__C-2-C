// controllers/messageController.js
const getMessage = (req, res) => {
  const { type, message, orderId } = req.query;

  // Check if this is a request from the frontend that expects HTML response
  const acceptsHtml = req.headers.accept && req.headers.accept.includes('text/html');

  if (acceptsHtml) {
    // If the request accepts HTML, send a simple HTML page that can redirect or display the message
    let htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Order Confirmation</title>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <style>
          body {
            font-family: Arial, sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
            background-color: #f5f5f5;
          }
          .container {
            text-align: center;
            background: white;
            padding: 40px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            max-width: 500px;
          }
          .success { color: #28a745; }
          .error { color: #dc3545; }
          .message {
            margin: 20px 0;
            font-size: 18px;
          }
          .order-id {
            background-color: #f8f9fa;
            padding: 10px;
            border-radius: 4px;
            margin: 15px 0;
            font-family: monospace;
          }
          .redirect {
            margin-top: 20px;
            font-size: 14px;
            color: #6c757d;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1 class="${type === 'success' ? 'success' : 'error'}">
            ${type === 'success' ? '✓ Success!' : '✗ Error!'}
          </h1>
          <div class="message">
            ${message || 'Operation completed successfully'}
          </div>
          ${orderId ? `<div class="order-id">Order ID: ${orderId}</div>` : ''}
          <div class="redirect">
            You will be redirected shortly...
          </div>

          ${orderId ? `
          <div style="margin-top: 20px;">
            <a href="/api/receipt/${orderId}/receipt" target="_blank" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 4px; margin: 5px;">
              View Receipt
            </a>
            <a href="/api/receipt/${orderId}/receipt?download=true" id="downloadLink" style="display: inline-block; padding: 10px 20px; background-color: #28a745; color: white; text-decoration: none; border-radius: 4px; margin: 5px;">
              Download PDF Receipt
            </a>
          </div>
          ` : ''}
        </div>

        <script>
          // Auto-download the PDF receipt after a short delay
          setTimeout(() => {
            ${orderId ? `
            // Create a temporary link and click it to trigger download
            const link = document.createElement('a');
            link.href = '/api/receipt/${orderId}/receipt?download=true';
            link.style.display = 'none';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            // Show a message that download has started
            const downloadMsg = document.createElement('div');
            downloadMsg.innerHTML = '<p style=\"color: #28a745; margin-top: 15px;\">Receipt download started! Check your downloads folder.</p>';
            document.querySelector('.container').appendChild(downloadMsg);
            ` : ''}
          }, 1000); // Wait 1 second before auto-download

          // Also redirect to order page after some time
          setTimeout(() => {
            try {
              window.location.href = '/order/${orderId || ''}';
            } catch (e) {
              window.location.href = '/';
            }
          }, 5000); // Wait 5 seconds before redirecting
        </script>
      </body>
      </html>
    `;
    res.status(200).send(htmlContent);
  } else {
    // For API requests, return JSON response
    res.status(200).json({
      success: type === 'success',
      type,
      message: message || 'Operation completed successfully',
      orderId: orderId || null,
      timestamp: new Date().toISOString()
    });
  }
};

module.exports = {
  getMessage
};