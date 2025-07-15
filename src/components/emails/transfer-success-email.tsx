interface TransferSuccessEmailProps {
  amount: string;
  recipient: string;
  transactionId: string;
}

export function TransferSuccessEmail({
  amount,
  recipient,
  transactionId,
}: TransferSuccessEmailProps) {
  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        maxWidth: "600px",
        margin: "0 auto",
      }}
    >
      {/* Header */}
      <div
        style={{
          background: "linear-gradient(to right, #18181b, #27272a, #18181b)",
          padding: "28px 24px",
          borderRadius: "16px 16px 0 0",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Animated background elements */}
        <div
          style={{
            position: "absolute",
            top: "20px",
            left: "20px",
            width: "32px",
            height: "32px",
            background: "rgba(96, 165, 250, 0.2)",
            borderRadius: "50%",
            animation: "pulse 2s infinite",
          }}
        ></div>
        <div
          style={{
            position: "absolute",
            bottom: "20px",
            right: "20px",
            width: "24px",
            height: "24px",
            background: "rgba(192, 132, 252, 0.2)",
            borderRadius: "50%",
            animation: "pulse 2s infinite 1s",
          }}
        ></div>

        <h1
          style={{
            color: "#ffffff",
            margin: "0",
            fontSize: "24px",
            fontWeight: "600",
          }}
        >
          SecureBank
        </h1>
      </div>

      {/* Content */}
      <div
        style={{
          background: "#ffffff",
          padding: "32px 24px",
          borderRadius: "0 0 16px 16px",
        }}
      >
        <div
          style={{
            display: "inline-block",
            background: "#d1fae5",
            color: "#065f46",
            padding: "6px 12px",
            borderRadius: "8px",
            fontSize: "14px",
            fontWeight: "600",
            marginBottom: "16px",
          }}
        >
          ✓ Transfer Successful
        </div>

        <h2
          style={{
            color: "#18181b",
            fontSize: "24px",
            fontWeight: "600",
            marginBottom: "16px",
          }}
        >
          Transfer Completed
        </h2>

        <p
          style={{
            color: "#52525b",
            fontSize: "16px",
            lineHeight: "1.5",
            marginBottom: "24px",
          }}
        >
          Your money transfer has been completed successfully.
        </p>

        <div
          style={{
            background: "linear-gradient(to right, #18181b, #27272a, #18181b)",
            borderRadius: "16px",
            padding: "24px",
            marginBottom: "24px",
            color: "#ffffff",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
              marginBottom: "16px",
            }}
          >
            <p
              style={{ margin: "0 0 8px 0", fontSize: "14px", opacity: "0.7" }}
            >
              Amount Sent
            </p>
            <p style={{ margin: "0", fontSize: "32px", fontWeight: "700" }}>
              {amount}
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "16px",
              borderTop: "1px solid rgba(255, 255, 255, 0.1)",
              paddingTop: "16px",
            }}
          >
            <div>
              <p
                style={{
                  margin: "0 0 4px 0",
                  fontSize: "12px",
                  opacity: "0.7",
                }}
              >
                Recipient
              </p>
              <p style={{ margin: "0", fontSize: "14px" }}>{recipient}</p>
            </div>
            <div>
              <p
                style={{
                  margin: "0 0 4px 0",
                  fontSize: "12px",
                  opacity: "0.7",
                }}
              >
                Transaction ID
              </p>
              <p style={{ margin: "0", fontSize: "14px" }}>{transactionId}</p>
            </div>
            <div>
              <p
                style={{
                  margin: "0 0 4px 0",
                  fontSize: "12px",
                  opacity: "0.7",
                }}
              >
                Date & Time
              </p>
              <p style={{ margin: "0", fontSize: "14px" }}>
                {new Date().toLocaleString()}
              </p>
            </div>
            <div>
              <p
                style={{
                  margin: "0 0 4px 0",
                  fontSize: "12px",
                  opacity: "0.7",
                }}
              >
                Status
              </p>
              <div
                style={{
                  display: "inline-block",
                  background: "#d1fae5",
                  color: "#065f46",
                  padding: "4px 8px",
                  borderRadius: "6px",
                  fontSize: "14px",
                  fontWeight: "600",
                }}
              >
                Completed
              </div>
            </div>
          </div>
        </div>

        <div
          style={{
            background: "#f0f9ff",
            border: "1px solid #0ea5e9",
            borderRadius: "7px",
            padding: "12px",
            marginBottom: "24px",
          }}
        >
          <p style={{ color: "#0c4a6e", fontSize: "14px", margin: "0" }}>
            📱 <strong>Mobile Banking:</strong> You can track all your transfers
            and view transaction history in our mobile app.
          </p>
        </div>

        <div style={{ textAlign: "center", marginBottom: "24px" }}>
          <a
            href="#"
            style={{
              display: "inline-block",
              background: "#18181b",
              color: "#ffffff",
              padding: "12px 24px",
              textDecoration: "none",
              borderRadius: "8px",
              fontSize: "14px",
              fontWeight: "600",
            }}
          >
            View Transaction Details
          </a>
        </div>

        <p
          style={{
            color: "#52525b",
            fontSize: "14px",
            lineHeight: "1.5",
            marginBottom: "16px",
          }}
        >
          The recipient should receive the funds within a few minutes. If you
          have any questions about this transfer, please keep your transaction
          ID handy when contacting support.
        </p>

        <p style={{ color: "#71717a", fontSize: "14px", lineHeight: "1.5" }}>
          Thank you for using SecureBank's transfer services.
        </p>

        <div
          style={{
            marginTop: "32px",
            paddingTop: "20px",
            borderTop: "1px solid #e5e7eb",
          }}
        >
          <p
            style={{ color: "#a1a1aa", fontSize: "12px", textAlign: "center" }}
          >
            Stellarone Holdings | Route des Acacias 60, 1211 Genève 73,
            Switzerland
            <br />
            This is an automated message, please do not reply.
          </p>
        </div>
      </div>
    </div>
  );
}
