interface StatementRequestEmailProps {
  period: string;
  downloadLink: string;
}

export function StatementRequestEmail({
  period,
  downloadLink,
}: StatementRequestEmailProps) {
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
          Your Statement is Ready
        </h2>

        <p
          style={{
            color: "#52525b",
            fontSize: "16px",
            lineHeight: "1.5",
            marginBottom: "24px",
          }}
        >
          Your requested account statement for {period} has been generated and
          is ready for download.
        </p>

        <div
          style={{
            background: "linear-gradient(to right, #18181b, #27272a, #18181b)",
            borderRadius: "12px",
            padding: "24px",
            marginBottom: "24px",
            color: "#ffffff",
            textAlign: "center",
          }}
        >
          <div
            style={{
              width: "64px",
              height: "64px",
              background: "rgba(255, 255, 255, 0.1)",
              borderRadius: "12px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 16px auto",
            }}
          >
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="16" y1="13" x2="8" y2="13"></line>
              <line x1="16" y1="17" x2="8" y2="17"></line>
              <polyline points="10 9 9 9 8 9"></polyline>
            </svg>
          </div>

          <h3
            style={{ fontSize: "18px", margin: "0 0 8px 0", fontWeight: "600" }}
          >
            Account Statement
          </h3>
          <p style={{ margin: "0 0 16px 0", fontSize: "14px", opacity: "0.7" }}>
            Period: {period}
          </p>

          <a
            href={downloadLink}
            style={{
              display: "inline-block",
              background: "rgba(255, 255, 255, 0.1)",
              color: "#ffffff",
              padding: "12px 24px",
              textDecoration: "none",
              borderRadius: "8px",
              fontSize: "14px",
              fontWeight: "600",
              border: "1px solid rgba(255, 255, 255, 0.2)",
            }}
          >
            Download Statement
          </a>
        </div>

        <div
          style={{
            background: "#fef3c7",
            border: "1px solid #f59e0b",
            borderRadius: "10px",
            padding: "20px",
            marginBottom: "24px",
          }}
        >
          <p style={{ color: "#92400e", fontSize: "14px", margin: "0" }}>
            <strong>Security Notice:</strong> This download link will expire in
            7 days for your security. Please save the statement to your device
            if you need it for future reference.
          </p>
        </div>

        <p
          style={{
            color: "#52525b",
            fontSize: "14px",
            lineHeight: "1.5",
            marginBottom: "24px",
          }}
        >
          Your statement includes all transactions, deposits, withdrawals, and
          fees for the specified period. Please review it carefully and contact
          us if you notice any discrepancies.
        </p>

        <div
          style={{
            background: "#f8fafc",
            border: "1px solid #e2e8f0",
            borderRadius: "10px",
            padding: "20px",
            marginBottom: "24px",
          }}
        >
          <p style={{ color: "#475569", fontSize: "14px", margin: "0" }}>
            <strong>Going Paperless:</strong> You can set up automatic monthly
            statements in your online banking preferences to receive them via
            email.
          </p>
        </div>

        <p style={{ color: "#71717a", fontSize: "14px", lineHeight: "1.5" }}>
          If you have any questions about your statement or need additional
          copies, please contact our customer service team.
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
