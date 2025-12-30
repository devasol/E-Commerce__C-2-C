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
        <title>${type === 'success' ? 'Order Successful' : 'Order Failed'} - E-Commerce</title>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
            background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
            padding: 20px;
          }
          .container {
            text-align: center;
            background: white;
            padding: 40px;
            border-radius: 12px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
            max-width: 500px;
            width: 100%;
            position: relative;
            overflow: hidden;
          }
          .container::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 6px;
            background: ${type === 'success' ? '#28a745' : '#dc3545'};
          }
          .icon {
            width: 70px;
            height: 70px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 20px;
            font-size: 30px;
            ${type === 'success' ?
              'background-color: #d4edda; color: #155724;' :
              'background-color: #f8d7da; color: #721c24;'}
          }
          h1 {
            margin: 0 0 15px;
            font-size: 28px;
            color: ${type === 'success' ? '#155724' : '#721c24'};
          }
          .message {
            margin: 15px 0;
            font-size: 18px;
            color: #333;
            line-height: 1.5;
          }
          .order-id {
            background-color: #f8f9fa;
            padding: 12px;
            border-radius: 6px;
            margin: 15px 0;
            font-family: monospace;
            font-size: 16px;
            border: 1px solid #e9ecef;
            display: inline-block;
          }
          .actions {
            margin: 25px 0;
          }
          .btn {
            display: inline-block;
            padding: 12px 24px;
            margin: 8px;
            text-decoration: none;
            border-radius: 6px;
            font-weight: 600;
            font-size: 16px;
            transition: all 0.3s ease;
            cursor: pointer;
            border: none;
          }
          .btn-primary {
            background-color: #007bff;
            color: white;
          }
          .btn-primary:hover {
            background-color: #0056b3;
            transform: translateY(-2px);
            box-shadow: 0 4px 8px rgba(0,0,0,0.1);
          }
          .btn-success {
            background-color: #28a745;
            color: white;
          }
          .btn-success:hover {
            background-color: #1e7e34;
            transform: translateY(-2px);
            box-shadow: 0 4px 8px rgba(0,0,0,0.1);
          }
          .btn-secondary {
            background-color: #6c757d;
            color: white;
          }
          .btn-secondary:hover {
            background-color: #545b62;
            transform: translateY(-2px);
            box-shadow: 0 4px 8px rgba(0,0,0,0.1);
          }
          .status {
            margin-top: 20px;
            padding: 15px;
            border-radius: 6px;
            background-color: ${type === 'success' ? '#d4edda' : '#f8d7da'};
            color: ${type === 'success' ? '#155724' : '#721c24'};
            border: 1px solid ${type === 'success' ? '#c3e6cb' : '#f5c6cb'};
          }
          .redirect {
            margin-top: 25px;
            font-size: 14px;
            color: #6c757d;
          }
          .download-status {
            margin-top: 15px;
            padding: 10px;
            border-radius: 4px;
            background-color: #d4edda;
            color: #155724;
            display: none;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="icon">
            ${type === 'success' ? '✓' : '✗'}
          </div>
          <h1>${type === 'success' ? 'Order Confirmed!' : 'Order Failed!'}</h1>
          <div class="message">
            ${message || (type === 'success' ? 'Your order has been placed successfully!' : 'There was an issue processing your order.')}
          </div>
          ${orderId ? `<div class="order-id">Order ID: ${orderId}</div>` : ''}

          <div class="status">
            <strong>Status:</strong> ${type === 'success' ? 'Your order is being processed. A confirmation email has been sent to your email address.' : 'Please try again or contact support if the issue persists.'}
          </div>

          <div class="actions">
            ${orderId ? `
            <a href="/api/receipt/${orderId}/receipt" target="_blank" class="btn btn-primary">
              View Receipt in New Tab
            </a>
            <a href="/api/receipt/${orderId}/receipt?download=true" id="downloadLink" class="btn btn-success">
              Download PDF Receipt
            </a>
            ` : ''}
            <a href="/" class="btn btn-secondary">
              Continue Shopping
            </a>
          </div>

          ${orderId ? `
          <div style="margin-top: 30px; border-top: 1px solid #eee; padding-top: 20px;">
            <h3 style="color: #333; margin-bottom: 15px;">Order Receipt</h3>
            <div id="receipt-container" style="border: 1px solid #ddd; border-radius: 8px; padding: 20px; background-color: #fff; max-height: 400px; overflow-y: auto;">
              <div id="receipt-content">Loading receipt...</div>
            </div>
          </div>
          ` : ''}

          <div id="downloadStatus" class="download-status">
            Receipt download started! Check your downloads folder.
          </div>

          <div class="redirect">
            You will be redirected to the homepage in a few seconds...
          </div>
        </div>

        <script>
          // Function to load receipt data and generate HTML
          async function loadReceiptContent() {
            if (!"${orderId}") return;

            try {
              // Fetch receipt data from API
              const response = await fetch('/api/receipt-data/${orderId}/data', {
                headers: {
                  'Authorization': 'Bearer ' + getAuthToken()
                }
              });

              if (!response.ok) {
                throw new Error('Failed to fetch receipt data');
              }

              const receiptData = await response.json();
              if (!receiptData.success) {
                throw new Error('Receipt data not available');
              }

              const data = receiptData.data;

              // Generate receipt HTML
              let receiptHtml = '';
              receiptHtml += '<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">';
              receiptHtml += '<div style="text-align: center; border-bottom: 2px solid #333; padding-bottom: 20px; margin-bottom: 30px;">';
              receiptHtml += '<h1 style="margin: 0; font-size: 24px;">ORDER RECEIPT</h1>';
              receiptHtml += '<div style="font-size: 18px; font-weight: bold; color: #007bff; margin-top: 10px;">Order ID: ' + data.orderId + '</div>';
              receiptHtml += '<div style="font-size: 16px; color: #666; margin-top: 5px;">Date: ' + data.orderDate + '</div>';
              receiptHtml += '</div>';

              receiptHtml += '<div style="margin-bottom: 25px;">';
              receiptHtml += '<div style="font-size: 18px; font-weight: bold; border-bottom: 1px solid #eee; padding-bottom: 8px; margin-bottom: 15px; color: #333;">Order Items</div>';
              receiptHtml += '<table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">';
              receiptHtml += '<thead>';
              receiptHtml += '<tr style="background-color: #f8f9fa;">';
              receiptHtml += '<th style="padding: 12px; text-align: left; border: 1px solid #ddd;">Product</th>';
              receiptHtml += '<th style="padding: 12px; text-align: left; border: 1px solid #ddd;">Quantity</th>';
              receiptHtml += '<th style="padding: 12px; text-align: left; border: 1px solid #ddd;">Price</th>';
              receiptHtml += '<th style="padding: 12px; text-align: left; border: 1px solid #ddd;">Total</th>';
              receiptHtml += '</tr>';
              receiptHtml += '</thead>';
              receiptHtml += '<tbody>';

              data.orderItems.forEach(item => {
                receiptHtml += '<tr>';
                receiptHtml += '<td style="padding: 12px; border: 1px solid #ddd;">' + item.name + '</td>';
                receiptHtml += '<td style="padding: 12px; border: 1px solid #ddd;">' + item.quantity + '</td>';
                receiptHtml += '<td style="padding: 12px; border: 1px solid #ddd;">$' + parseFloat(item.price).toFixed(2) + '</td>';
                receiptHtml += '<td style="padding: 12px; border: 1px solid #ddd;">$' + item.total + '</td>';
                receiptHtml += '</tr>';
              });

              receiptHtml += '</tbody>';
              receiptHtml += '</table>';
              receiptHtml += '</div>';

              receiptHtml += '<div style="margin-bottom: 25px;">';
              receiptHtml += '<div style="font-size: 18px; font-weight: bold; border-bottom: 1px solid #eee; padding-bottom: 8px; margin-bottom: 15px; color: #333;">Order Summary</div>';
              receiptHtml += '<div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #eee;">';
              receiptHtml += '<span>Items Price:</span>';
              receiptHtml += '<span>$' + data.itemsPrice.toFixed(2) + '</span>';
              receiptHtml += '</div>';
              receiptHtml += '<div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #eee;">';
              receiptHtml += '<span>Tax:</span>';
              receiptHtml += '<span>$' + data.taxPrice.toFixed(2) + '</span>';
              receiptHtml += '</div>';
              receiptHtml += '<div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #eee;">';
              receiptHtml += '<span>Shipping:</span>';
              receiptHtml += '<span>$' + data.shippingPrice.toFixed(2) + '</span>';
              receiptHtml += '</div>';
              receiptHtml += '<div style="display: flex; justify-content: space-between; padding: 15px 0; border-top: 2px solid #333; font-weight: bold; font-size: 18px;">';
              receiptHtml += '<span>Total:</span>';
              receiptHtml += '<span>$' + data.totalPrice.toFixed(2) + '</span>';
              receiptHtml += '</div>';
              receiptHtml += '</div>';

              receiptHtml += '<div style="margin-bottom: 25px;">';
              receiptHtml += '<div style="font-size: 18px; font-weight: bold; border-bottom: 1px solid #eee; padding-bottom: 8px; margin-bottom: 15px; color: #333;">Shipping Address</div>';
              receiptHtml += '<div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; border-left: 4px solid #007bff;">';
              receiptHtml += '<p style="margin: 5px 0;"><strong>' + data.shippingAddress.fullName + '</strong></p>';
              receiptHtml += '<p style="margin: 5px 0;">' + data.shippingAddress.address + '</p>';
              receiptHtml += '<p style="margin: 5px 0;">' + data.shippingAddress.city + ', ' + data.shippingAddress.state + ' ' + data.shippingAddress.zipCode + '</p>';
              receiptHtml += '<p style="margin: 5px 0;">' + data.shippingAddress.country + '</p>';
              if (data.shippingAddress.phone) {
                receiptHtml += '<p style="margin: 5px 0;">Phone: ' + data.shippingAddress.phone + '</p>';
              }
              receiptHtml += '</div>';
              receiptHtml += '</div>';

              receiptHtml += '<div style="margin-bottom: 25px;">';
              receiptHtml += '<div style="font-size: 18px; font-weight: bold; border-bottom: 1px solid #eee; padding-bottom: 8px; margin-bottom: 15px; color: #333;">Payment Information</div>';
              receiptHtml += '<div style="background-color: #e8f5e9; padding: 15px; border-radius: 5px; border-left: 4px solid #28a745;">';
              receiptHtml += '<p style="margin: 5px 0;"><strong>Payment Method:</strong> ' + data.paymentMethod + '</p>';
              receiptHtml += '<p style="margin: 5px 0;"><strong>Status:</strong> ' + (data.isPaid ? 'PAID' : 'PENDING') + '</p>';
              if (data.paidAt) {
                receiptHtml += '<p style="margin: 5px 0;"><strong>Paid At:</strong> ' + data.paidAt + '</p>';
              }
              if (data.paymentResult && data.paymentResult.id) {
                receiptHtml += '<p style="margin: 5px 0;"><strong>Transaction ID:</strong> ' + data.paymentResult.id + '</p>';
              }
              receiptHtml += '</div>';
              receiptHtml += '</div>';

              receiptHtml += '<div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; color: #666; font-size: 14px;">';
              receiptHtml += '<p>Thank you for your purchase!</p>';
              receiptHtml += '<p>If you have any questions about your order, please contact us.</p>';
              receiptHtml += '<p>This is an automated receipt, please do not reply directly to this message.</p>';
              receiptHtml += '</div>';
              receiptHtml += '</div>';

              document.getElementById('receipt-content').innerHTML = receiptHtml;
            } catch (error) {
              console.error('Error loading receipt:', error);
              document.getElementById('receipt-content').innerHTML = '<p>Failed to load receipt. Please try viewing it in a new tab.</p>';
            }
          }

          // Helper function to get auth token from localStorage or cookies
          function getAuthToken() {
            // Try to get token from localStorage (common for JWT tokens)
            const token = localStorage.getItem('token') || localStorage.getItem('authToken');
            if (token) {
              return token.startsWith('Bearer ') ? token : 'Bearer ' + token;
            }

            // If not in localStorage, try to get from cookies
            const cookies = document.cookie.split(';');
            for (let cookie of cookies) {
              const [name, value] = cookie.trim().split('=');
              if (name === 'token' || name === 'authToken') {
                return value ? 'Bearer ' + value : '';
              }
            }

            return '';
          }

          // Load receipt content when page loads
          if ("${orderId}") {
            loadReceiptContent();
          }

          // Auto-download the PDF receipt after a short delay
          setTimeout(() => {
            if ("${orderId}") {
              // Create a temporary link and click it to trigger download
              const link = document.createElement('a');
              link.href = '/api/receipt/${orderId}/receipt?download=true';
              link.style.display = 'none';
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);

              // Show a message that download has started
              const downloadStatus = document.getElementById('downloadStatus');
              downloadStatus.style.display = 'block';
            }
          }, 1500); // Wait 1.5 seconds before auto-download

          // Also redirect to homepage after some time
          setTimeout(() => {
            window.location.href = '/';
          }, 8000); // Wait 8 seconds before redirecting

          // Handle manual download if auto-download fails
          var downloadLink = document.getElementById('downloadLink');
          if (downloadLink) {
            downloadLink.addEventListener('click', function(e) {
              setTimeout(function() {
                const downloadStatus = document.getElementById('downloadStatus');
                downloadStatus.style.display = 'block';
              }, 500);
            });
          }
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
      message: message || (type === 'success' ? 'Operation completed successfully' : 'Operation failed'),
      orderId: orderId || null,
      timestamp: new Date().toISOString()
    });
  }
};

module.exports = {
  getMessage
};