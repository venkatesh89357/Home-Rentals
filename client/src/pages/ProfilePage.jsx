import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import "../styles/Register.scss";
import { setLogin } from "../redux/state";
import { getImageUrl } from "../utils/image";

const ProfilePage = () => {
  const user = useSelector((state) => state.user);
  const token = useSelector((state) => state.token);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [form, setForm] = useState({ firstName: "", lastName: "", email: "" });
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    setForm({
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      email: user.email || "",
    });

    if (user.profileImagePath) {
      setPreviewUrl(getImageUrl(user.profileImagePath));
    }
  }, [user]);

  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith('blob:')) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'profileImage') {
      if (files && files[0]) {
        setImageFile(files[0]);
        const url = URL.createObjectURL(files[0]);
        setPreviewUrl(url);
      }
      return;
    }
    setForm((p) => ({ ...p, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('firstName', form.firstName);
      formData.append('lastName', form.lastName);
      formData.append('email', form.email);
      if (imageFile) formData.append('profileImage', imageFile);

      const response = await fetch(`http://localhost:8000/users/${user._id}`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const result = await response.json();
      if (!response.ok) {
        setError(result.message || result.error || 'Update failed');
        setLoading(false);
        return;
      }

      // update Redux user
      dispatch(setLogin({ user: result.user, token }));
      setLoading(false);
      alert('Profile updated');
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="register">
      <div className="register_content">
        <h1>My Profile</h1>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <form className="register_content_form" onSubmit={handleSubmit} encType="multipart/form-data">
          <input name="firstName" placeholder="First Name" value={form.firstName} onChange={handleChange} disabled={loading} />
          <input name="lastName" placeholder="Last Name" value={form.lastName} onChange={handleChange} disabled={loading} />
          <input name="email" placeholder="Email" value={form.email} onChange={handleChange} disabled={loading} />

          <input id="profileImage" name="profileImage" type="file" accept="image/*" style={{ display: 'none' }} onChange={handleChange} disabled={loading} />
          <label htmlFor="profileImage" style={{ cursor: 'pointer', marginBottom: 10 }}>
            <img src="assets/addImage.png" alt="upload" style={{ width: 40 }} />
            <p>Change Profile Photo</p>
          </label>

          {previewUrl && (
            <img src={previewUrl} alt="preview" style={{ maxWidth: 120, borderRadius: '50%', marginBottom: 10 }} />
          )}

          <button type="submit" disabled={loading}>{loading ? 'UPDATING...' : 'UPDATE PROFILE'}</button>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;
