interface DepositRejectedEmailProps {
  amount: string;
  transactionId: string;
  reason: string;
}

export function DepositRejectedEmail({
  amount,
  transactionId,
  reason,
}: DepositRejectedEmailProps) {
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
          ❌ Deposit Rejected
        </div>

        <h2
          style={{
            color: "#18181b",
            fontSize: "24px",
            fontWeight: "600",
            marginBottom: "16px",
          }}
        >
          Deposit Could Not Be Processed
        </h2>

        <p
          style={{
            color: "#52525b",
            fontSize: "16px",
            lineHeight: "1.5",
            marginBottom: "24px",
          }}
        >
          We were unable to process your recent deposit. Please review the
          details below and take the necessary action to resolve this issue.
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
            Rejected Deposit Details
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
                Transaction ID
              </p>
              <p style={{ color: "#991b1b", margin: "0", fontSize: "16px" }}>
                {transactionId}
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
                Rejection Reason
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
                Date
              </p>
              <p style={{ color: "#991b1b", margin: "0", fontSize: "16px" }}>
                {new Date().toLocaleDateString()}
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
            Common Rejection Reasons & Solutions
          </h3>
          <div
            style={{ color: "#92400e", fontSize: "14px", lineHeight: "1.6" }}
          >
            <div style={{ marginBottom: "12px" }}>
              <strong>Invalid Signature:</strong> Ensure the signature on the
              check matches your account signature on file
            </div>
            <div style={{ marginBottom: "12px" }}>
              <strong>Insufficient Funds:</strong> The check writer's account
              may not have sufficient funds
            </div>
            <div style={{ marginBottom: "12px" }}>
              <strong>Damaged Check:</strong> Check may be torn, illegible, or
              missing required information
            </div>
            <div style={{ marginBottom: "12px" }}>
              <strong>Stale Date:</strong> Check may be older than 6 months or
              post-dated
            </div>
            <div>
              <strong>Account Closed:</strong> The check writer's account may be
              closed or frozen
            </div>
          </div>
        </div>

        <div
          style={{
            background: "#f0f9ff",
            border: "1px solid #0ea5e9",
            borderRadius: "16px",
            padding: "24px",
            marginBottom: "24px",
          }}
        >
          <h3
            style={{
              color: "#0c4a6e",
              fontSize: "18px",
              margin: "0 0 16px 0",
              fontWeight: "600",
            }}
          >
            What You Can Do Next
          </h3>
          <ul
            style={{
              color: "#0c4a6e",
              fontSize: "14px",
              paddingLeft: "20px",
              margin: "0",
              lineHeight: "1.6",
            }}
          >
            <li style={{ marginBottom: "8px" }}>
              <strong>Contact the Check Writer:</strong> Verify the check
              details and request a replacement if needed
            </li>
            <li style={{ marginBottom: "8px" }}>
              <strong>Visit a Branch:</strong> Bring the original check to
              discuss alternative deposit options
            </li>
            <li style={{ marginBottom: "8px" }}>
              <strong>Mobile Deposit:</strong> Try depositing again with better
              lighting and image quality
            </li>
            <li style={{ marginBottom: "8px" }}>
              <strong>Alternative Payment:</strong> Request an electronic
              transfer or cashier's check instead
            </li>
            <li>
              <strong>Update Signature:</strong> If signature mismatch, visit a
              branch to update your signature card
            </li>
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
          No funds have been added to your account due to this rejection. If you
          believe this rejection was made in error, please contact our customer
          support team immediately.
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
              marginRight: "12px",
            }}
          >
            Contact Support
          </a>
          <a
            href="#"
            style={{
              display: "inline-block",
              background: "transparent",
              color: "#18181b",
              padding: "12px 24px",
              textDecoration: "none",
              borderRadius: "12px",
              fontSize: "14px",
              fontWeight: "600",
              border: "1px solid #e2e8f0",
            }}
          >
            Find Branch
          </a>
        </div>

        <div
          style={{
            background: "#f8fafc",
            border: "1px solid #e2e8f0",
            borderRadius: "12px",
            padding: "16px",
            marginBottom: "24px",
          }}
        >
          <p style={{ color: "#64748b", fontSize: "14px", margin: "0" }}>
            💡 <strong>Prevention Tip:</strong> For mobile deposits, ensure good
            lighting, steady hands, and that all four corners of the check are
            visible in the image.
          </p>
        </div>

        <p style={{ color: "#71717a", fontSize: "14px", lineHeight: "1.5" }}>
          We apologize for any inconvenience this may cause. Our team is here to
          help resolve this issue quickly and get your deposit processed.
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
