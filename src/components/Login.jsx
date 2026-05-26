import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Box,
    TextField,
    Button,
    Typography,
    InputAdornment,
    IconButton,
    Alert,
    CircularProgress,
    Link,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useAuth } from "../Context/AuthContext";
import { INTELICONVOAPI } from "../utils/axiosInstance";
import heroImg from "../assets/login screen img.png";

const validationSchema = Yup.object({
    email: Yup.string()
        .email("Enter a valid email address")
        .required("Email is required"),
    password: Yup.string()
        .required("Password is required"),
});

export default function Login() {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [showPassword, setShowPassword] = useState(false);
    const [serverError, setServerError] = useState("");

    const formik = useFormik({
        initialValues: { email: "", password: "" },
        validationSchema,
        onSubmit: async (values, { setSubmitting }) => {
            setServerError("");
            try {
                const response = await INTELICONVOAPI.post("/auth/user/login", {
                    email: values.email,
                    password: values.password,
                });
                const result = login(response.data);
                if (result.success) {
                    navigate("/tickets");
                } else {
                    setServerError(result.message);
                }
            } catch (err) {
                const msg =
                    err.response?.data?.message ||
                    err.response?.data?.detail ||
                    "Login failed. Please check your credentials.";
                setServerError(msg);
            } finally {
                setSubmitting(false);
            }
        },
    });

    return (
        <Box
            sx={{
                width: "100%",
                minHeight: "100vh",
                display: "flex",
                bgcolor: "#ffffff",
            }}
        >
            {/* Left side - Illustration */}
            <Box
                sx={{
                    flex: 1.3, // Give the image container more room
                    display: { xs: "none", md: "flex" },
                    alignItems: "center",
                    justifyContent: "flex-start", // Align from left to have exact control over the left gap
                    pl: { md: 6, lg: 10 }, // A controlled 'little gap' from the left
                    pr: { md: 4, lg: 6 }, // Controlled distance to the form
                }}
            >
                <Box
                    component="img"
                    src={heroImg}
                    alt="Login Illustration"
                    sx={{
                        maxWidth: "100%",
                        maxHeight: "94vh", // Keep the image large
                        objectFit: "contain",
                        border: "4px solid #000000",
                        borderRadius: "2px",
                        display: "block",
                    }}
                />
            </Box>

            {/* Right side - Login Form */}
            <Box
                sx={{
                    flex: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    p: { xs: 4, sm: 8 },
                }}
            >
                <Box
                    sx={{
                        width: "100%",
                        maxWidth: 400,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-start", // Left-aligned as per screenshot
                    }}
                >
                    {/* Header Group */}
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 5, alignSelf: 'flex-start' }}>
                        <Typography
                            variant="subtitle2"
                            sx={{
                                mb: 0.5,
                                color: "#64748b",
                                fontFamily: "'Inter', sans-serif",
                                fontWeight: 600,
                                letterSpacing: "0.2em",
                                textTransform: "uppercase",
                                fontSize: "0.95rem", // Increased size slightly
                            }}
                        >
                            Welcome to
                        </Typography>
                        
                        {/* Logo/Title */}
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#8b5cf6' }}>
                                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M11.9998 22L2 16.5165V18.1758L11.9998 23.6593L22 18.1758V16.5165L11.9998 22ZM11.9998 18.7033L2 13.2198V14.8791L11.9998 20.3626L22 14.8791V13.2198L11.9998 18.7033ZM11.9998 15.4066L2 9.92308L11.9998 4.43956L22 9.92308L11.9998 15.4066Z" fill="currentColor" opacity="0.6" />
                                    <path d="M11.9998 15.4066L2 9.92308L11.9998 4.43956L22 9.92308L11.9998 15.4066Z" fill="currentColor" />
                                </svg>
                            </Box>
                            <Typography variant="h2" sx={{ fontWeight: 500, fontFamily: "'Inter', sans-serif", letterSpacing: "-1px" }}>
                                <Box component="span" sx={{ color: "#0ea5e9" }}>OmniCX </Box>
                                <Box component="span" sx={{ color: "#10b981", fontWeight: 600 }}>AI</Box>
                            </Typography>
                        </Box>
                    </Box>

                    {serverError && (
                        <Alert severity="error" sx={{ width: "100%", mb: 3, borderRadius: 1 }}>
                            {serverError}
                        </Alert>
                    )}

                    <Box component="form" onSubmit={formik.handleSubmit} noValidate sx={{ width: "100%" }}>
                        <Typography sx={{ fontWeight: 600, fontSize: "0.95rem", mb: 1, color: "#64748b" }}>
                            Email Address *
                        </Typography>
                        <TextField
                            fullWidth
                            placeholder="Enter your email address"
                            name="email"
                            type="email"
                            value={formik.values.email}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.email && Boolean(formik.errors.email)}
                            helperText={formik.touched.email && formik.errors.email}
                            sx={{
                                mb: 3,
                                "& .MuiOutlinedInput-root": {
                                    borderRadius: "6px",
                                    bgcolor: "#fff",
                                    fontSize: "1.05rem",
                                },
                                "& .MuiOutlinedInput-input": {
                                    padding: "18px 14px",
                                }
                            }}
                        />

                        <Typography sx={{ fontWeight: 600, fontSize: "0.95rem", mb: 1, color: "#64748b" }}>
                            Password *
                        </Typography>
                        <TextField
                            fullWidth
                            placeholder="Enter your password"
                            name="password"
                            type={showPassword ? "text" : "password"}
                            value={formik.values.password}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.password && Boolean(formik.errors.password)}
                            helperText={formik.touched.password && formik.errors.password}
                            sx={{
                                mb: 4,
                                "& .MuiOutlinedInput-root": {
                                    borderRadius: "6px",
                                    bgcolor: "#fff",
                                    fontSize: "1.05rem",
                                },
                                "& .MuiOutlinedInput-input": {
                                    padding: "18px 14px",
                                }
                            }}
                            slotProps={{
                                input: {
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton onClick={() => setShowPassword((v) => !v)} edge="end" size="small">
                                                {showPassword ? <VisibilityOff fontSize="small" sx={{ color: "#94a3b8" }} /> : <Visibility fontSize="small" sx={{ color: "#94a3b8" }} />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                },
                            }}
                        />

                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            disabled={formik.isSubmitting}
                            disableElevation
                            sx={{
                                py: 1.8,
                                fontSize: "1.1rem",
                                fontWeight: 600,
                                textTransform: "none",
                                borderRadius: "6px",
                                bgcolor: "#208ce4",
                                "&:hover": { bgcolor: "#1a75c2" },
                            }}
                        >
                            {formik.isSubmitting ? <CircularProgress size={24} sx={{ color: "#fff" }} /> : "Login"}
                        </Button>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
}
