interface OTPEmailProps {
  otpCode: string;
}

export function OTPEmail({ otpCode }: OTPEmailProps) {
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
          Your One-Time Password
        </h2>

        <p
          style={{
            color: "#52525b",
            fontSize: "16px",
            lineHeight: "1.5",
            marginBottom: "24px",
          }}
        >
          Use the following code to complete your login. This code will expire
          in 10 minutes.
        </p>

        <div
          style={{
            background: "linear-gradient(to right, #18181b, #27272a, #18181b)",
            borderRadius: "10px",
            padding: "24px",
            textAlign: "center",
            marginBottom: "24px",
          }}
        >
          <div
            style={{
              fontSize: "32px",
              fontWeight: "bold",
              color: "#ffffff",
              letterSpacing: "8px",
              fontFamily: "monospace",
            }}
          >
            {otpCode}
          </div>
        </div>

        <div
          style={{
            background: "#f8fafc",
            border: "1px solid #e2e8f0",
            borderRadius: "9px",
            padding: "16px",
            marginBottom: "24px",
          }}
        >
          <p style={{ color: "#64748b", fontSize: "14px", margin: "0" }}>
            <strong className="text-red-700">Security Tip:</strong> Never share
            this code with anyone, including SecureBank staff. We will never ask
            for your OTP via phone or email.
          </p>
        </div>

        <p style={{ color: "#71717a", fontSize: "14px", lineHeight: "1.5" }}>
          If you didn't request this code, please ignore this email or contact
          our support team immediately.
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
