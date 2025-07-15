interface LoanApprovalEmailProps {
  loanAmount: string;
  interestRate: string;
  loanId: string;
}

export function LoanApprovalEmail({
  loanAmount,
  interestRate,
  loanId,
}: LoanApprovalEmailProps) {
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
            borderRadius: "6px",
            fontSize: "14px",
            fontWeight: "600",
            marginBottom: "16px",
          }}
        >
          🎉 Approved
        </div>

        <h2
          style={{
            color: "#18181b",
            fontSize: "24px",
            fontWeight: "600",
            marginBottom: "16px",
          }}
        >
          Your Loan Has Been Approved!
        </h2>

        <p
          style={{
            color: "#52525b",
            fontSize: "16px",
            lineHeight: "1.5",
            marginBottom: "24px",
          }}
        >
          Congratulations! We're pleased to inform you that your loan
          application has been approved.
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
              Loan Amount
            </p>
            <p style={{ margin: "0", fontSize: "32px", fontWeight: "700" }}>
              {loanAmount}
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
                Interest Rate
              </p>
              <p style={{ margin: "0", fontSize: "14px" }}>
                {interestRate} APR
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
                Loan ID
              </p>
              <p style={{ margin: "0", fontSize: "14px" }}>{loanId}</p>
            </div>
            <div>
              <p
                style={{
                  margin: "0 0 4px 0",
                  fontSize: "12px",
                  opacity: "0.7",
                }}
              >
                Approval Date
              </p>
              <p style={{ margin: "0", fontSize: "14px" }}>
                {new Date().toLocaleDateString()}
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
              <p style={{ margin: "0", fontSize: "14px" }}>Approved</p>
            </div>
          </div>
        </div>

        <div
          style={{
            background: "#fef3c7",
            border: "1px solid #f59e0b",
            borderRadius: "12px",
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
            Next Steps
          </h3>
          <ol
            style={{
              color: "#92400e",
              fontSize: "14px",
              paddingLeft: "20px",
              margin: "0",
              lineHeight: "1.6",
            }}
          >
            <li style={{ marginBottom: "8px" }}>
              Review and sign the loan agreement documents
            </li>
            <li style={{ marginBottom: "8px" }}>
              Provide any additional documentation if required
            </li>
            <li style={{ marginBottom: "8px" }}>
              Schedule a meeting with your loan officer
            </li>
            <li>
              Funds will be disbursed within 3-5 business days after completion
            </li>
          </ol>
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
              borderRadius: "7px",
              fontSize: "14px",
              fontWeight: "600",
            }}
          >
            View Loan Details
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
          A loan officer will contact you within 24 hours to discuss the next
          steps and answer any questions you may have.
        </p>

        <p style={{ color: "#71717a", fontSize: "14px", lineHeight: "1.5" }}>
          Thank you for choosing SecureBank for your financing needs. We look
          forward to serving you.
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
