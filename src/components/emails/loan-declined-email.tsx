interface LoanDeclinedEmailProps {
  loanAmount: string;
  applicationId: string;
}

export function LoanDeclinedEmail({
  loanAmount,
  applicationId,
}: LoanDeclinedEmailProps) {
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
            borderRadius: "7px",
            fontSize: "14px",
            fontWeight: "600",
            marginBottom: "16px",
          }}
        >
          ❌ Application Declined
        </div>

        <h2
          style={{
            color: "#18181b",
            fontSize: "24px",
            fontWeight: "600",
            marginBottom: "16px",
          }}
        >
          Loan Application Update
        </h2>

        <p
          style={{
            color: "#52525b",
            fontSize: "16px",
            lineHeight: "1.5",
            marginBottom: "24px",
          }}
        >
          Thank you for your interest in SecureBank's loan services. After
          careful review of your application, we are unable to approve your loan
          request at this time.
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
          <h3
            style={{
              color: "#475569",
              fontSize: "18px",
              margin: "0 0 16px 0",
              fontWeight: "600",
            }}
          >
            Application Details
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
                  color: "#64748b",
                  margin: "0 0 4px 0",
                  fontSize: "14px",
                  fontWeight: "600",
                }}
              >
                Requested Amount
              </p>
              <p style={{ color: "#475569", margin: "0", fontSize: "16px" }}>
                {loanAmount}
              </p>
            </div>
            <div>
              <p
                style={{
                  color: "#64748b",
                  margin: "0 0 4px 0",
                  fontSize: "14px",
                  fontWeight: "600",
                }}
              >
                Application ID
              </p>
              <p style={{ color: "#475569", margin: "0", fontSize: "16px" }}>
                {applicationId}
              </p>
            </div>
            <div>
              <p
                style={{
                  color: "#64748b",
                  margin: "0 0 4px 0",
                  fontSize: "14px",
                  fontWeight: "600",
                }}
              >
                Review Date
              </p>
              <p style={{ color: "#475569", margin: "0", fontSize: "16px" }}>
                {new Date().toLocaleDateString()}
              </p>
            </div>
            <div>
              <p
                style={{
                  color: "#64748b",
                  margin: "0 0 4px 0",
                  fontSize: "14px",
                  fontWeight: "600",
                }}
              >
                Status
              </p>
              <div
                style={{
                  display: "inline-block",
                  background: "#fef2f2",
                  color: "#991b1b",
                  padding: "6px 12px",
                  borderRadius: "7px",
                  fontSize: "14px",
                  fontWeight: "600",
                }}
              >
                Declined
              </div>
            </div>
          </div>
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
          <h3
            style={{
              color: "#92400e",
              fontSize: "18px",
              margin: "0 0 16px 0",
              fontWeight: "600",
            }}
          >
            Common Reasons for Decline
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
              Credit score below minimum requirements
            </li>
            <li style={{ marginBottom: "8px" }}>
              Insufficient income to support loan payments
            </li>
            <li style={{ marginBottom: "8px" }}>High debt-to-income ratio</li>
            <li style={{ marginBottom: "8px" }}>
              Incomplete or missing documentation
            </li>
            <li>Recent negative credit events</li>
          </ul>
        </div>

        <div
          style={{
            background: "#f0f9ff",
            border: "1px solid #0ea5e9",
            borderRadius: "10px",
            padding: "20px",
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
            Next Steps & Alternatives
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
              <strong>Improve Your Credit:</strong> Work on paying down existing
              debt and making timely payments
            </li>
            <li style={{ marginBottom: "8px" }}>
              <strong>Consider a Secured Loan:</strong> Explore our secured loan
              options with collateral
            </li>
            <li style={{ marginBottom: "8px" }}>
              <strong>Add a Co-signer:</strong> Apply with a qualified co-signer
              to strengthen your application
            </li>
            <li style={{ marginBottom: "8px" }}>
              <strong>Lower Loan Amount:</strong> Consider applying for a
              smaller loan amount
            </li>
            <li>
              <strong>Reapply Later:</strong> You can reapply after 6 months
              with improved financial standing
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
          We understand this may be disappointing news. Our loan specialists are
          available to discuss alternative options and provide guidance on
          improving your eligibility for future applications.
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
            Speak with Specialist
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
            View Credit Report
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
            💡 <strong>Free Credit Monitoring:</strong> Sign up for our free
            credit monitoring service to track your progress and get notified
            when you're eligible to reapply.
          </p>
        </div>

        <p style={{ color: "#71717a", fontSize: "14px", lineHeight: "1.5" }}>
          Thank you for considering SecureBank for your financing needs. We're
          here to help you achieve your financial goals and look forward to
          serving you in the future.
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
