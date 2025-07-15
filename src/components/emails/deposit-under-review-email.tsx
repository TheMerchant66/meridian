interface DepositUnderReviewEmailProps {
  amount: string;
  transactionId: string;
}

export function DepositUnderReviewEmail({
  amount,
  transactionId,
}: DepositUnderReviewEmailProps) {
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
        <h2
          style={{
            color: "#18181b",
            fontSize: "24px",
            fontWeight: "600",
            marginBottom: "16px",
          }}
        >
          Deposit Under Review
        </h2>

        <p
          style={{
            color: "#52525b",
            fontSize: "16px",
            lineHeight: "1.5",
            marginBottom: "24px",
          }}
        >
          We have received your deposit and it is currently under review for
          security purposes.
        </p>

        <div
          style={{
            background: "#fef3c7",
            border: "1px solid #f59e0b",
            borderRadius: "11px",
            padding: "20px",
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
            Transaction Details
          </h3>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "12px",
            }}
          >
            <div>
              <p
                style={{
                  color: "#92400e",
                  margin: "0 0 8px 0",
                  fontSize: "14px",
                  fontWeight: "600",
                }}
              >
                Amount
              </p>
              <p style={{ color: "#92400e", margin: "0", fontSize: "16px" }}>
                {amount}
              </p>
            </div>
            <div>
              <p
                style={{
                  color: "#92400e",
                  margin: "0 0 8px 0",
                  fontSize: "14px",
                  fontWeight: "600",
                }}
              >
                Transaction ID
              </p>
              <p style={{ color: "#92400e", margin: "0", fontSize: "16px" }}>
                {transactionId}
              </p>
            </div>
            <div>
              <p
                style={{
                  color: "#92400e",
                  margin: "0 0 8px 0",
                  fontSize: "14px",
                  fontWeight: "600",
                }}
              >
                Status
              </p>
              <p style={{ color: "#92400e", margin: "0", fontSize: "16px" }}>
                Under Review
              </p>
            </div>
            <div>
              <p
                style={{
                  color: "#92400e",
                  margin: "0 0 8px 0",
                  fontSize: "14px",
                  fontWeight: "600",
                }}
              >
                Date
              </p>
              <p style={{ color: "#92400e", margin: "0", fontSize: "16px" }}>
                {new Date().toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        <p
          style={{
            color: "#52525b",
            fontSize: "14px",
            lineHeight: "1.5",
            marginBottom: "24px",
          }}
        >
          This review process typically takes 1-3 business days. We will notify
          you once the deposit has been processed and the funds are available in
          your account.
        </p>

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
            <strong>Note:</strong> For faster processing in the future, consider
            using our mobile app for deposits.
          </p>
        </div>

        <p style={{ color: "#71717a", fontSize: "14px", lineHeight: "1.5" }}>
          If you have any questions about this transaction, please contact our
          customer support team at (555) 123-4567.
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
