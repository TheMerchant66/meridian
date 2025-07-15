interface TransferFailedEmailProps {
  amount: string;
  recipient: string;
  reason: string;
}

export function TransferFailedEmail({
  amount,
  recipient,
  reason,
}: TransferFailedEmailProps) {
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
            background: "#fef2f2",
            color: "#991b1b",
            padding: "6px 12px",
            borderRadius: "20px",
            fontSize: "14px",
            fontWeight: "600",
            marginBottom: "16px",
          }}
        >
          ❌ Transfer Failed
        </div>

        <h2
          style={{
            color: "#18181b",
            fontSize: "24px",
            fontWeight: "600",
            marginBottom: "16px",
          }}
        >
          Transfer Unsuccessful
        </h2>

        <p
          style={{
            color: "#52525b",
            fontSize: "16px",
            lineHeight: "1.5",
            marginBottom: "24px",
          }}
        >
          We were unable to process your recent transfer request. Please review
          the details below.
        </p>

        <div
          style={{
            background: "#fef2f2",
            border: "1px solid #ef4444",
            borderRadius: "16px",
            padding: "24px",
            marginBottom: "24px",
          }}
        >
          <h3
            style={{
              color: "#991b1b",
              fontSize: "18px",
              margin: "0 0 16px 0",
              fontWeight: "600",
            }}
          >
            Failed Transfer Details
          </h3>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "16px",
            }}
          >
            <div>
              <p
                style={{
                  color: "#991b1b",
                  margin: "0 0 4px 0",
                  fontSize: "14px",
                  fontWeight: "600",
                }}
              >
                Amount
              </p>
              <p style={{ color: "#991b1b", margin: "0", fontSize: "16px" }}>
                {amount}
              </p>
            </div>
            <div>
              <p
                style={{
                  color: "#991b1b",
                  margin: "0 0 4px 0",
                  fontSize: "14px",
                  fontWeight: "600",
                }}
              >
                Recipient
              </p>
              <p style={{ color: "#991b1b", margin: "0", fontSize: "16px" }}>
                {recipient}
              </p>
            </div>
            <div>
              <p
                style={{
                  color: "#991b1b",
                  margin: "0 0 4px 0",
                  fontSize: "14px",
                  fontWeight: "600",
                }}
              >
                Reason
              </p>
              <p style={{ color: "#991b1b", margin: "0", fontSize: "16px" }}>
                {reason}
              </p>
            </div>
            <div>
              <p
                style={{
                  color: "#991b1b",
                  margin: "0 0 4px 0",
                  fontSize: "14px",
                  fontWeight: "600",
                }}
              >
                Date & Time
              </p>
              <p style={{ color: "#991b1b", margin: "0", fontSize: "16px" }}>
                {new Date().toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div
          style={{
            background: "#fef3c7",
            border: "1px solid #f59e0b",
            borderRadius: "16px",
            padding: "24px",
            marginBottom: "24px",
          }}
        >
          <h3
            style={{
              color: "#92400e",
              fontSize: "18px",
              margin: "0 0 16px 0",
              fontWeight: "600",
            }}
          >
            What to do next:
          </h3>
          <ul
            style={{
              color: "#92400e",
              fontSize: "14px",
              paddingLeft: "20px",
              margin: "0",
              lineHeight: "1.6",
            }}
          >
            <li style={{ marginBottom: "8px" }}>
              Check your account balance and ensure sufficient funds
            </li>
            <li style={{ marginBottom: "8px" }}>
              Verify the recipient's information is correct
            </li>
            <li style={{ marginBottom: "8px" }}>
              Try the transfer again through your online banking
            </li>
            <li>Contact customer support if the issue persists</li>
          </ul>
        </div>

        <p
          style={{
            color: "#52525b",
            fontSize: "16px",
            lineHeight: "1.5",
            marginBottom: "24px",
          }}
        >
          No funds have been deducted from your account due to this failed
          transfer. You can attempt the transfer again at any time.
        </p>

        <div style={{ textAlign: "center", marginBottom: "24px" }}>
          <a
            href="#"
            style={{
              display: "inline-block",
              background: "#18181b",
              color: "#ffffff",
              padding: "12px 24px",
              textDecoration: "none",
              borderRadius: "12px",
              fontSize: "14px",
              fontWeight: "600",
            }}
          >
            Try Transfer Again
          </a>
        </div>

        <p style={{ color: "#71717a", fontSize: "14px", lineHeight: "1.5" }}>
          If you need assistance, please contact our customer support team at
          (555) 123-4567 or visit your nearest branch.
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
            Meridian Private Holdings | Route des Acacias 60, 1211 Genève 73,
            Switzerland
            <br />
            This is an automated message, please do not reply.
          </p>
        </div>
      </div>
    </div>
  );
}
