interface DepositConfirmationEmailProps {
  amount: string;
  balance: string;
  transactionId: string;
}

export function DepositConfirmationEmail({
  amount,
  balance,
  transactionId,
}: DepositConfirmationEmailProps) {
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
          Deposit Confirmed
        </h2>

        <p
          style={{
            color: "#52525b",
            fontSize: "16px",
            lineHeight: "1.5",
            marginBottom: "24px",
          }}
        >
          Great news! Your deposit has been successfully processed and the funds
          are now available in your account.
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
              Deposited Amount
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
                New Balance
              </p>
              <p style={{ margin: "0", fontSize: "14px", fontWeight: "600" }}>
                {balance}
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
                Date
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
              <p
                style={{
                  margin: "0",
                  fontSize: "14px",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                <span
                  style={{
                    color: "#ffffff",
                    background: "#22c55e",
                    width: "18px",
                    height: "18px",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "12px",
                    fontWeight: "bold",
                  }}
                >
                  ✔
                </span>{" "}
                Completed
              </p>
            </div>
          </div>
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
            <strong>Tip:</strong> You can view your complete transaction history
            and account statements in your online banking dashboard.
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
              borderRadius: "12px",
              fontSize: "14px",
              fontWeight: "600",
            }}
          >
            View Account Details
          </a>
        </div>

        <p style={{ color: "#71717a", fontSize: "14px", lineHeight: "1.5" }}>
          Thank you for banking with SecureBank. If you have any questions,
          please don't hesitate to contact us.
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
