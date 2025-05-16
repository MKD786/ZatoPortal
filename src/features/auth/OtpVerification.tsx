import { useDispatch } from "react-redux"
import { clearError } from "./auth.slice"
import ZatoLogoDark from "../../assets/Zato Logo Blue Tilt.png"
import { Footer } from "antd/es/layout/layout"
import type React from "react"
import { useState, useEffect, useRef} from "react"
import { useNavigate } from "react-router-dom"
import { Form, Button, Typography, Card, Alert } from "antd";
import './Otp.scss';

const { Title, Text } = Typography

interface OtpVerificationProps {
    email?: string
    onVerificationSuccess?: () => void
}

const OTPPage = ({ onVerificationSuccess }: OtpVerificationProps) => {
    const dispatch =useDispatch();
    const navigate = useNavigate()
    const [otp, setOtp] = useState<string[]>(Array(6).fill(""))
    const [timeLeft, setTimeLeft] = useState<number>(60) // 3 minutes in seconds
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState<boolean>(false)
    const [loading, setLoading] = useState<boolean>(false)
    const inputRefs = useRef<(HTMLInputElement | null)[]>([])

    // Format time as MM:SS
    const formatTime = (seconds: number): string => {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
    }

    // Handle countdown timer
    useEffect(() => {
        if (timeLeft <= 0) return

        const timer = setInterval(() => {
            setTimeLeft((prev) => prev - 1)
        }, 1000)

        return () => clearInterval(timer)
    }, [timeLeft])

    // Handle OTP input change
    const handleChange = (index: number, value: string) => {
        // Only allow numbers
        if (!/^\d*$/.test(value)) return

        const newOtp = [...otp]
        newOtp[index] = value
        setOtp(newOtp)

        // Auto-focus next input
        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus()
        }
    }

    // Handle key press for backspace
    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus()
        }
    }

    // Handle paste functionality
    const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
        e.preventDefault()
        const pastedData = e.clipboardData.getData("text").trim()

        // Check if pasted content is a 6-digit number
        if (/^\d{6}$/.test(pastedData)) {
            const digits = pastedData.split("")
            setOtp(digits)

            // Focus the last input
            inputRefs.current[5]?.focus()
        }
    }

    // Handle OTP verification
    const verifyOtp = async () => {
        setLoading(true)
        setError(null)

        try {
            // In a real app, you would make an API call here
            await new Promise((resolve) => setTimeout(resolve, 1000))

            const otpString = otp.join("")

            // Mock verification - in a real app, this would be an API call
            if (otpString === "123456") {
                setSuccess(true)
                setTimeout(() => {
                    if (onVerificationSuccess) {
                        onVerificationSuccess()
                    } else {
                        navigate("/questionnaires")
                    }
                }, 1500)
            } else {
                setError("Invalid verification code. Please try again.")
            }
        } catch (err) {
            setError("An error occurred during verification. Please try again.")
        } finally {
            setLoading(false)
        }
    }

    // Handle resend OTP
    const resendOtp = async () => {
        setLoading(true)
        setError(null)

        try {
            // In a real app, you would make an API call here
            await new Promise((resolve) => setTimeout(resolve, 1000))

            // Reset timer
            setTimeLeft(180)

            // Clear OTP fields
            setOtp(Array(6).fill(""))

            // Focus first input
            inputRefs.current[0]?.focus()
        } catch (err) {
            setError("Failed to resend verification code. Please try again.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4 zato-login-bg">
            <div className="absolute top-10 left-10 w-40">
                <img src={ZatoLogoDark} alt="Zato Logo" className="login-logo" />
            </div>
            <div className="flex flex-col items-center" style={{ width: "35%" }}>
                <h1 className="form-decision">From Data to Decisions</h1>
                <p className="text-gray-900 dark:text-gray-400 mb-4">AI-Powered Compliance for Tomorrow’s Accounting</p>
                <Card className="w-full shadow-lg rounded-lg" bordered={false}>
                    <div className="text-center mb-6">
                        <Title level={5} className="text-gray-500 dark:text-gray-400" type="secondary">OTP Verification</Title>
                    </div>

                    {error && (
                        <Alert
                            message="Login Failed"
                            description={error}
                            type="error"
                            showIcon
                            closable
                            onClose={() => dispatch(clearError())}
                            className="mb-4"
                        />
                    )}

                    <Form name="login" className="otp-form" layout="vertical">
                    <div className="otp-container">
                        {otp.map((digit, index) => (
                            <input
                                key={index}
                                ref={(el) => (inputRefs.current[index] = el)}
                                type="password"
                                maxLength={1}
                                value={digit}
                                onChange={(e) => handleChange(index, e.target.value)}
                                onKeyDown={(e) => handleKeyDown(index, e)}
                                onPaste={index === 0 ? handlePaste : undefined}
                                className="otp-input"
                                disabled={loading || success}
                                autoFocus={index === 0}
                            />
                        ))}
                    </div>

                        <Form.Item style={{ marginBottom: "0px" }}>
                        <div className="flex justify-between items-center">
                            <Text disabled={timeLeft > 0 || loading || success} onClick={resendOtp} className="resend-button">{timeLeft > 0 ? formatTime(timeLeft) : "Resend Code"}</Text>
                            <Button type="primary" onClick={verifyOtp} size="large" disabled={otp.join("").length !== 6 || loading || success} loading={loading} className="w-32">
                                Verify
                            </Button>
                        </div>
                    </Form.Item>
                    </Form>
                </Card>
            </div>

            <Footer className="fixed bottom-0 right-0 z-10 w-full text-end p-0" style={{ padding: "0.3rem 0.5rem" }}>
                <div className="flex justify-end items-center gap-2">
                    <p className="text-xs" style={{ color: "#c6cbd5" }}>Powered by</p>
                    <div className="w-10">
                        <img src={ZatoLogoDark} alt="Zato Logo" />
                    </div>
                </div>
            </Footer>
        </div>
    )
}

export default OTPPage;

 