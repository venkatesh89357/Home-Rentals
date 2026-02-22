import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom"
import "../styles/Register.scss";

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    profileImage: null,
  });

  const [passwordMatch, setPasswordMatch] = useState(true);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    const newFormData = {
      ...formData,
      [name]: name === "profileImage" ? files[0] : value,
    };
    setFormData(newFormData);

    // Create preview URL for image
    if (name === "profileImage" && files[0]) {
      // Revoke old URL if exists
      if (imagePreviewUrl) {
        URL.revokeObjectURL(imagePreviewUrl);
      }
      const newUrl = URL.createObjectURL(files[0]);
      setImagePreviewUrl(newUrl);
    }
  };

  useEffect(() => {
    setPasswordMatch(formData.password === formData.confirmPassword || formData.confirmPassword === "")
  }, [formData.password, formData.confirmPassword])

  // Cleanup URL on unmount
  useEffect(() => {
    return () => {
      if (imagePreviewUrl) {
        URL.revokeObjectURL(imagePreviewUrl);
      }
    };
  }, []);

  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validate required fields
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.password || !formData.profileImage) {
      setError("All fields are required!");
      return;
    }

    if (!passwordMatch) {
      setError("Passwords do not match!");
      return;
    }

    setLoading(true);

    try {
      const register_form = new FormData()
      register_form.append("firstName", formData.firstName);
      register_form.append("lastName", formData.lastName);
      register_form.append("email", formData.email);
      register_form.append("password", formData.password);
      register_form.append("profileImage", formData.profileImage);

      const response = await fetch("http://localhost:8000/auth/register", {
        method: "POST",
        body: register_form
      })

      const result = await response.json();

      if (!response.ok) {
        setError(result.message || "Registration failed. Please try again.");
        setLoading(false);
        return;
      }

      if (response.ok) {
        navigate("/login");
      }
    } catch (err) {
      setError("Registration failed: " + err.message);
      console.log("Registration failed", err.message)
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="register">
      <div className="register_content">
        <form className="register_content_form" onSubmit={handleSubmit}>
          {error && <p style={{ color: "red", marginBottom: "10px" }}>{error}</p>}
          <input
            placeholder="First Name"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            required
            disabled={loading}
          />
          <input
            placeholder="Last Name"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            required
            disabled={loading}
          />
          <input
            placeholder="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
            disabled={loading}
          />
          <input
            placeholder="Password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            type="password"
            required
            disabled={loading}
          />
          <input
            placeholder="Confirm Password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            type="password"
            required
            disabled={loading}
          />

          {!passwordMatch && (
            <p style={{ color: "red" }}>Passwords are not matched!</p>
          )}

          <input
            id="image"
            type="file"
            name="profileImage"
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleChange}
            required
            disabled={loading}
          />
          <label htmlFor="image">
            <img src="assets/addImage.png" alt="add profile photo" />
            <p>Upload Your Photo</p>
          </label>

          {imagePreviewUrl && (
            <img
              src={imagePreviewUrl}
              alt="profile photo"
              style={{ maxWidth: "80px" }}
            />
          )}
          <button type="submit" disabled={!passwordMatch || loading}>
            {loading ? "REGISTERING..." : "REGISTER"}
          </button>
        </form>
        <Link to="/login">Already have an account? Log In Here</Link>
      </div>
    </div>
  );
};

export default RegisterPage;