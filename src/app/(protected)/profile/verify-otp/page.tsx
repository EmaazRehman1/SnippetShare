// 'use client'
// import React, { useState, useRef, useEffect } from 'react';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Card, CardContent, CardHeader, CardTitle, CardDescription,CardFooter } from '@/components/ui/card';
// import { Alert, AlertDescription } from '@/components/ui/alert';
// import { Loader2, Mail, CheckCircle } from 'lucide-react';
// import { useUser } from '@/common/hooks/useUser';
// import { toast } from 'sonner';
// import { set } from 'lodash';
// import { useRouter } from 'next/navigation';

// const VerifyOtp = () => {
//     const [otp, setOtp] = useState<string[]>(new Array(6).fill(''));
//     const [activeIndex, setActiveIndex] = useState<number>(0);
//     const [error, setError] = useState<string>('');
//     const [success, setSuccess] = useState<boolean>(false);
//     const [resendTimer, setResendTimer] = useState<number>(60);
//     const [canResend, setCanResend] = useState<boolean>(false);
//     const { user } = useUser();
//     const [loading, setLoading] = useState(false);
//     const [verifying, setVerifying] = useState(false);
//     const [otpSent, setOtpSent] = useState(false);
//     const router = useRouter()


//     const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

//     const sendOtp = async () => {
//         setLoading(true);
//         try {
//             const resp = await fetch('/api/send-otp', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify({ email: user?.email }),
//             });
//             const data = await resp.json();
//             if (data.success) {
//                 toast.success("OTP sent to your email");
//                 setOtpSent(true);
//             } else {
//                 toast.error("Failed to send OTP");
//             }
//         } catch (error) {
//             console.log(error);
//             toast.error("Error sending OTP");
//         } finally {
//             setLoading(false);
//         }
//     };

//     useEffect(() => {
//         let interval: NodeJS.Timeout;
//         if (resendTimer > 0 && !canResend) {
//             interval = setInterval(() => {
//                 setResendTimer(prev => prev - 1);
//             }, 1000);
//         } else {
//             setCanResend(true);
//         }
//         return () => clearInterval(interval);
//     }, [resendTimer, canResend]);

//     const handleChange = (index: number, value: string) => {
//         setError('');

//         // Only allow digits
//         if (!/^\d*$/.test(value)) return;

//         const newOtp = [...otp];

//         // Handle single digit input
//         if (value.length === 1) {
//             newOtp[index] = value;
//             setOtp(newOtp);

//             // Move to next input if value is entered
//             if (index < 5) {
//                 setActiveIndex(index + 1);
//                 inputRefs.current[index + 1]?.focus();
//             }
//         }
//         // Handle paste of complete OTP
//         else if (value.length === 6) {
//             const digits = value.split('');
//             for (let i = 0; i < 6; i++) {
//                 newOtp[i] = digits[i] || '';
//             }
//             setOtp(newOtp);
//             setActiveIndex(5);
//             inputRefs.current[5]?.focus();
//         }
//         // Handle backspace or empty value
//         else if (value.length === 0) {
//             newOtp[index] = '';
//             setOtp(newOtp);
//         }
//     };

//     const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
//         if (e.key === 'Backspace') {
//             if (!otp[index] && index > 0) {
//                 setActiveIndex(index - 1);
//                 inputRefs.current[index - 1]?.focus();
//             } else {
//                 const newOtp = [...otp];
//                 newOtp[index] = '';
//                 setOtp(newOtp);
//             }
//         } else if (e.key === 'ArrowLeft' && index > 0) {
//             setActiveIndex(index - 1);
//             inputRefs.current[index - 1]?.focus();
//         } else if (e.key === 'ArrowRight' && index < 5) {
//             setActiveIndex(index + 1);
//             inputRefs.current[index + 1]?.focus();
//         }
//     };

//     const handlePaste = (e: React.ClipboardEvent) => {
//         e.preventDefault();
//         const pastedData = e.clipboardData.getData('text').replace(/\D/g, '');

//         if (pastedData.length === 6) {
//             const newOtp = pastedData.split('');
//             setOtp(newOtp);
//             setActiveIndex(5);
//             inputRefs.current[5]?.focus();
//         }
//     };

//     const handleSubmit = async () => {
//         const otpString = otp.join('');
//         if (otpString.length !== 6) {
//             setError('Please enter all 6 digits');
//             return;
//         }

//         setVerifying(true);
//         try {
//             const resp = await fetch('/api/verify-otp', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify({
//                     email: user?.email,
//                     otp: otpString
//                 }),
//             });

//             const data = await resp.json();
//             if (data.success) {
//                 setSuccess(true);
//                 toast.success("Verification successful!");
//             } else {
//                 setError(data.message || 'Invalid OTP. Please try again.');
//                 toast.error("Verification failed");
//             }
//         } catch (err) {
//             setError('An error occurred during verification.');
//             toast.error("Verification error");
//         } finally {
//             setVerifying(false);
//         }
//     };

//     const handleResend = async () => {
//         if (canResend) {
//             setResendTimer(60);
//             setCanResend(false);
//             setError('');
//             setOtp(new Array(6).fill(''));
//             setActiveIndex(0);
//             inputRefs.current[0]?.focus();
//             await sendOtp();
//         }
//     };

//     if (success) {
//         return (
//             <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
//                 <Card className="w-full max-w-md">
//                     <CardContent className="pt-6">
//                         <div className="text-center space-y-4">
//                             <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
//                                 <CheckCircle className="w-6 h-6 text-green-600" />
//                             </div>
//                             <h3 className="text-xl font-semibold text-gray-900">Verification Successful!</h3>
//                             <p className="text-gray-600">Your account has been verified successfully.</p>
//                             <Button className="w-full" onClick={() => router.push('/profile/env-files')}>
//                                 Continue
//                             </Button>
//                         </div>
//                     </CardContent>
//                 </Card>
//             </div>
//         );
//     }

//     return (
//         <div className="min-h-screen flex items-center justify-center p-4">
//             {!otpSent ? (
//                 <Card className="w-full max-w-md shadow-lg rounded-2xl border border-gray-200">
//                     <CardHeader className="text-center">
//                         <div className="flex justify-center mb-2">
//                             <Mail className="h-10 w-10 text-blue-600" />
//                         </div>
//                         <CardTitle className="text-xl font-semibold text-gray-800">
//                             Verify Your Email
//                         </CardTitle>
//                     </CardHeader>

//                     <CardContent>
//                         <p className="text-gray-600 text-center">
//                             To access your <span className="font-medium text-blue-600">environment files</span>, please verify your email by requesting an OTP.
//                         </p>
//                     </CardContent>

//                     <CardFooter className="flex justify-center">
//                         <Button onClick={sendOtp} className="w-full">
//                             Send OTP
//                         </Button>
//                     </CardFooter>
//                 </Card>


//             ) : (

//                 <Card className="w-full max-w-md shadow-lg bg-gray-200">
//                     <CardHeader className="text-center space-y-2">
//                         <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
//                             <Mail className="w-6 h-6 text-blue-600" />
//                         </div>
//                         <CardTitle className="text-2xl font-bold text-gray-900">Verify Your Email</CardTitle>
//                         <CardDescription className="text-gray-600">
//                             We've sent a 6-digit verification code to{' '}
//                             <span className="font-medium text-gray-900">{user?.email}</span>
//                         </CardDescription>
//                     </CardHeader>

//                     <CardContent className="space-y-6">
//                         <div className="space-y-6">
//                             {/* OTP Input Fields */}
//                             <div className="flex justify-center space-x-2">
//                                 {otp.map((digit, index) => (
//                                     <Input
//                                         key={index}
//                                         ref={el => { inputRefs.current[index] = el; }}
//                                         type="text"
//                                         inputMode="numeric"
//                                         maxLength={1}
//                                         value={digit}
//                                         onChange={e => handleChange(index, e.target.value)}
//                                         onKeyDown={e => handleKeyDown(index, e)}
//                                         onPaste={handlePaste}
//                                         onFocus={() => setActiveIndex(index)}
//                                         className={`w-12 h-12 text-center text-lg font-semibold border-2 transition-all duration-200 ${activeIndex === index
//                                             ? 'border-blue-500 ring-2 ring-blue-200'
//                                             : 'border-gray-200'
//                                             } ${error ? 'border-red-300' : ''}`}
//                                         autoComplete="off"
//                                     />
//                                 ))}
//                             </div>

//                             {error && (
//                                 <Alert variant="destructive">
//                                     <AlertDescription>{error}</AlertDescription>
//                                 </Alert>
//                             )}

//                             <Button
//                                 onClick={handleSubmit}
//                                 className="w-full h-11 text-base font-medium"
//                                 disabled={verifying || otp.join('').length !== 6}
//                             >
//                                 {verifying ? (
//                                     <>
//                                         <Loader2 className="w-4 h-4 mr-2 animate-spin" />
//                                         Verifying...
//                                     </>
//                                 ) : (
//                                     'Verify OTP'
//                                 )}
//                             </Button>
//                         </div>

//                         <div className="text-center space-y-2">
//                             <p className="text-sm text-gray-600">Didn't receive the code?</p>
//                             {canResend ? (
//                                 <Button
//                                     variant="ghost"
//                                     onClick={handleResend}
//                                     className="text-blue-600 hover:text-blue-700 font-medium"
//                                     disabled={loading}
//                                 >
//                                     {loading ? (
//                                         <>
//                                             <Loader2 className="w-4 h-4 mr-2 animate-spin" />
//                                             Sending...
//                                         </>
//                                     ) : (
//                                         'Resend Code'
//                                     )}
//                                 </Button>
//                             ) : (
//                                 <p className="text-sm text-gray-500">
//                                     Resend available in {resendTimer}s
//                                 </p>
//                             )}
//                         </div>

//                     </CardContent>
//                 </Card>
//             )}

//         </div>
//     );
// };

// export default VerifyOtp;
'use client'
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Mail, CheckCircle } from 'lucide-react';
import { useUser } from '@/common/hooks/useUser';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

const VerifyOtp = () => {
    const [otp, setOtp] = useState<string[]>(new Array(6).fill(''));
    const [activeIndex, setActiveIndex] = useState<number>(0);
    const [error, setError] = useState<string>('');
    const [success, setSuccess] = useState<boolean>(false);
    const [resendTimer, setResendTimer] = useState<number>(60);
    const [canResend, setCanResend] = useState<boolean>(false);
    const { user } = useUser();
    const [loading, setLoading] = useState(false);
    const [verifying, setVerifying] = useState(false);
    const [otpSent, setOtpSent] = useState(false);
    const router = useRouter();

    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    const sendOtp = async () => {
        setLoading(true);
        try {
            const resp = await fetch('/api/send-otp', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: user?.email }),
            });
            const data = await resp.json();
            if (data.success) {
                toast.success("OTP sent to your email");
                setOtpSent(true);
            } else {
                toast.error("Failed to send OTP");
            }
        } catch (error) {
            console.log(error);
            toast.error("Error sending OTP");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (resendTimer > 0 && !canResend) {
            interval = setInterval(() => {
                setResendTimer(prev => prev - 1);
            }, 1000);
        } else {
            setCanResend(true);
        }
        return () => clearInterval(interval);
    }, [resendTimer, canResend]);

    const handleChange = (index: number, value: string) => {
        setError('');

        // Only allow digits
        if (!/^\d*$/.test(value)) return;

        const newOtp = [...otp];

        // Handle single digit input
        if (value.length === 1) {
            newOtp[index] = value;
            setOtp(newOtp);

            // Move to next input if value is entered
            if (index < 5) {
                setActiveIndex(index + 1);
                inputRefs.current[index + 1]?.focus();
            }
        }
        // Handle paste of complete OTP
        else if (value.length === 6) {
            const digits = value.split('');
            for (let i = 0; i < 6; i++) {
                newOtp[i] = digits[i] || '';
            }
            setOtp(newOtp);
            setActiveIndex(5);
            inputRefs.current[5]?.focus();
        }
        // Handle backspace or empty value
        else if (value.length === 0) {
            newOtp[index] = '';
            setOtp(newOtp);
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
        if (e.key === 'Backspace') {
            if (!otp[index] && index > 0) {
                setActiveIndex(index - 1);
                inputRefs.current[index - 1]?.focus();
            } else {
                const newOtp = [...otp];
                newOtp[index] = '';
                setOtp(newOtp);
            }
        } else if (e.key === 'ArrowLeft' && index > 0) {
            setActiveIndex(index - 1);
            inputRefs.current[index - 1]?.focus();
        } else if (e.key === 'ArrowRight' && index < 5) {
            setActiveIndex(index + 1);
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handlePaste = (e: React.ClipboardEvent) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text').replace(/\D/g, '');

        if (pastedData.length === 6) {
            const newOtp = pastedData.split('');
            setOtp(newOtp);
            setActiveIndex(5);
            inputRefs.current[5]?.focus();
        }
    };

    const handleSubmit = async () => {
        const otpString = otp.join('');
        if (otpString.length !== 6) {
            setError('Please enter all 6 digits');
            return;
        }

        setVerifying(true);
        try {
            const resp = await fetch('/api/verify-otp', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: user?.email,
                    otp: otpString
                }),
            });

            const data = await resp.json();
            if (data.success) {
                setSuccess(true);
                toast.success("Verification successful!");
            } else {
                setError(data.message || 'Invalid OTP. Please try again.');
                toast.error("Verification failed");
            }
        } catch (err) {
            setError('An error occurred during verification.');
            toast.error("Verification error");
        } finally {
            setVerifying(false);
        }
    };

    const handleResend = async () => {
        if (canResend) {
            setResendTimer(60);
            setCanResend(false);
            setError('');
            setOtp(new Array(6).fill(''));
            setActiveIndex(0);
            inputRefs.current[0]?.focus();
            await sendOtp();
        }
    };

    if (success) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
                <Card className="w-full max-w-md">
                    <CardContent className="pt-6">
                        <div className="text-center space-y-4">
                            <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                                <CheckCircle className="w-6 h-6 text-green-600" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900">Verification Successful!</h3>
                            <p className="text-gray-600">Your account has been verified successfully.</p>
                            <Button className="w-full" onClick={() => router.push('/profile/env-files')}>
                                Continue
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br flex items-center justify-center p-4">
            {!otpSent ? (
                <Card className="w-full max-w-md shadow-lg rounded-2xl border border-gray-200">
                    <CardHeader className="text-center">
                        <div className="flex justify-center mb-2">
                            <Mail className="h-10 w-10 text-gray-600" />
                        </div>
                        <CardTitle className="text-xl font-semibold text-gray-800">
                            Verify Your Email
                        </CardTitle>
                    </CardHeader>

                    <CardContent>
                        <p className="text-gray-600 text-center">
                            To access your <span className="font-medium text-gray-700">environment files</span>, please verify your email by requesting an OTP.
                        </p>
                    </CardContent>

                    <CardFooter className="flex justify-center">
                        <Button onClick={sendOtp} className="w-full" variant="default">
                            {loading ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Sending...
                                </>
                            ) : (
                                'Send OTP'
                            )}
                        </Button>
                    </CardFooter>
                </Card>
            ) : (
                <Card className="w-full max-w-md shadow-lg">
                    <CardHeader className="text-center space-y-2">
                        <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                            <Mail className="w-6 h-6 text-gray-600" />
                        </div>
                        <CardTitle className="text-2xl font-bold text-gray-900">Verify Your Email</CardTitle>
                        <CardDescription className="text-gray-600">
                            We've sent a 6-digit verification code to{' '}
                            <span className="font-medium text-gray-900">{user?.email}</span>
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-6">
                        <div className="space-y-6">
                            {/* OTP Input Fields */}
                            <div className="flex justify-center space-x-2">
                                {otp.map((digit, index) => (
                                    <Input
                                        key={index}
                                        ref={el => { inputRefs.current[index] = el; }}
                                        type="text"
                                        inputMode="numeric"
                                        maxLength={1}
                                        value={digit}
                                        onChange={e => handleChange(index, e.target.value)}
                                        onKeyDown={e => handleKeyDown(index, e)}
                                        onPaste={handlePaste}
                                        onFocus={() => setActiveIndex(index)}
                                        className={`w-12 h-12 text-center text-lg font-semibold border-2 transition-all duration-200 ${activeIndex === index
                                            ? 'border-gray-700 ring-2 ring-gray-200'
                                            : 'border-gray-200'
                                            } ${error ? 'border-red-300' : ''}`}
                                        autoComplete="off"
                                    />
                                ))}
                            </div>

                            {error && (
                                <Alert variant="destructive">
                                    <AlertDescription>{error}</AlertDescription>
                                </Alert>
                            )}

                            <Button
                                onClick={handleSubmit}
                                className="w-full h-11 text-base font-medium"
                                disabled={verifying || otp.join('').length !== 6}
                            >
                                {verifying ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        Verifying...
                                    </>
                                ) : (
                                    'Verify OTP'
                                )}
                            </Button>
                        </div>

                        <div className="text-center space-y-2">
                            <p className="text-sm text-gray-600">Didn't receive the code?</p>
                            {canResend ? (
                                <Button
                                    variant="ghost"
                                    onClick={handleResend}
                                    className="text-gray-700 hover:text-gray-900 font-medium"
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            Sending...
                                        </>
                                    ) : (
                                        'Resend Code'
                                    )}
                                </Button>
                            ) : (
                                <p className="text-sm text-gray-500">
                                    Resend available in {resendTimer}s
                                </p>
                            )}
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
};

export default VerifyOtp;