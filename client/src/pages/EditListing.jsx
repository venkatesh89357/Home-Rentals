import "../styles/CreateListing.scss";
import { categories, types, facilities } from "../data";
import { RemoveCircleOutline, AddCircleOutline } from "@mui/icons-material";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { IoIosImages } from "react-icons/io";
import { useState, useEffect } from "react";
import { BiTrash } from "react-icons/bi";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { getImageUrl } from "../utils/image";
import { API_URL } from "../config/api";

const EditListing = () => {
  const { listingId } = useParams();
  const [loading, setLoading] = useState(true);
  const [listing, setListing] = useState(null);

  const [category, setCategory] = useState("");
  const [type, setType] = useState("");
  const [guestCount, setGuestCount] = useState(1);
  const [bedroomCount, setBedroomCount] = useState(1);
  const [bedCount, setBedCount] = useState(1);
  const [bathroomCount, setBathroomCount] = useState(1);

  const [amenities, setAmenities] = useState([]);

  const [existingPhotos, setExistingPhotos] = useState([]); // server paths
  const [removedPhotos, setRemovedPhotos] = useState([]);

  const [photos, setPhotos] = useState([]);
  const [photoUrls, setPhotoUrls] = useState([]);

  const [formLocation, setFormLocation] = useState({
    streetAddress: "",
    aptSuite: "",
    city: "",
    province: "",
    country: "",
  });

  const [formDescription, setFormDescription] = useState({
    title: "",
    description: "",
    highlight: "",
    highlightDesc: "",
    price: 0,
  });

  const [error, setError] = useState("");

  const token = useSelector((state) => state.token);
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();

  useEffect(() => {
    const getListing = async () => {
      try {
        const res = await fetch(`${API_URL}/properties/${listingId}`);
        const data = await res.json();
        setListing(data);

        // populate fields
        setCategory(data.category || "");
        setType(data.type || "");
        setGuestCount(data.guestCount || 1);
        setBedroomCount(data.bedroomCount || 1);
        setBedCount(data.bedCount || 1);
        setBathroomCount(data.bathroomCount || 1);
        setAmenities(Array.isArray(data.amenities) ? data.amenities : (typeof data.amenities === 'string' ? data.amenities.split(',') : []));
        setExistingPhotos(data.listingPhotoPaths || []);
        setFormLocation({
          streetAddress: data.streetAddress || "",
          aptSuite: data.aptSuite || "",
          city: data.city || "",
          province: data.province || "",
          country: data.country || "",
        });
        setFormDescription({
          title: data.title || "",
          description: data.description || "",
          highlight: data.highlight || "",
          highlightDesc: data.highlightDesc || "",
          price: data.price || 0,
        });

        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch listing', err.message);
      }
    };

    getListing();
  }, [listingId]);

  useEffect(() => {
    return () => {
      photoUrls.forEach((u) => URL.revokeObjectURL(u));
    };
  }, [photoUrls]);

  const handleSelectAmenities = (facility) => {
    if (amenities.includes(facility)) {
      setAmenities((prevAmenities) => prevAmenities.filter((option) => option !== facility));
    } else {
      setAmenities((prev) => [...prev, facility]);
    }
  };

  const handleUploadPhotos = (e) => {
    const newPhotos = Array.from(e.target.files || []);
    if (newPhotos.length === 0) return;
    setPhotos((prev) => [...prev, ...newPhotos]);
    const newUrls = newPhotos.map((f) => URL.createObjectURL(f));
    setPhotoUrls((prev) => [...prev, ...newUrls]);
    e.target.value = "";
  };

  const handleRemoveExisting = (idx) => {
    const path = existingPhotos[idx];
    setExistingPhotos((prev) => prev.filter((_, i) => i !== idx));
    setRemovedPhotos((prev) => [...prev, path]);
  };

  const handleRemoveNew = (idx) => {
    setPhotos((prev) => prev.filter((_, i) => i !== idx));
    URL.revokeObjectURL(photoUrls[idx]);
    setPhotoUrls((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleChangeLocation = (e) => {
    const { name, value } = e.target;
    setFormLocation((p) => ({ ...p, [name]: value }));
  };

  const handleChangeDescription = (e) => {
    const { name, value } = e.target;
    setFormDescription((p) => ({ ...p, [name]: value }));
  };

  const handlePost = async (e) => {
    e.preventDefault();
    setError("");

    if (!user || !token) {
      setError('Please login');
      navigate('/login');
      return;
    }

    setLoading(true);

    try {
      const form = new FormData();
      form.append('category', category);
      form.append('type', type);
      form.append('streetAddress', formLocation.streetAddress);
      form.append('aptSuite', formLocation.aptSuite);
      form.append('city', formLocation.city);
      form.append('province', formLocation.province);
      form.append('country', formLocation.country);
      form.append('guestCount', guestCount);
      form.append('bedroomCount', bedroomCount);
      form.append('bedCount', bedCount);
      form.append('bathroomCount', bathroomCount);
      form.append('amenities', JSON.stringify(amenities));
      form.append('title', formDescription.title);
      form.append('description', formDescription.description);
      form.append('highlight', formDescription.highlight);
      form.append('highlightDesc', formDescription.highlightDesc);
      form.append('price', formDescription.price);

      // attach removed photos list so server can remove them
      form.append('removedPhotos', JSON.stringify(removedPhotos));

      photos.forEach((p) => form.append('listingPhotos', p));

      const res = await fetch(`${API_URL}/properties/${listingId}`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: form,
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.message || 'Failed to update');
        setLoading(false);
        return;
      }

      alert('Listing updated');
      navigate(`/${user._id}/properties`);
    } catch (err) {
      console.error('Update failed', err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div style={{ padding: 40 }}>Loading...</div>;

  return (
    <div className="create-listing">
      <h1>Edit Your Listing</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handlePost}>
        <div className="create-listing_step1">
          <h2>Step 1: Tell us about your place</h2>
          <hr />
          <h3>Which of these categories best describes your place?</h3>
          <div className="category-list">
            {categories?.map((item, index) => (
              <div
                className={`category ${category === item.label ? 'selected' : ''}`}
                key={index}
                onClick={() => setCategory(item.label)}
              >
                <div className="category_icon">{item.icon}</div>
                <p>{item.label}</p>
              </div>
            ))}
          </div>

          <h3>What type of place will guests have?</h3>
          <div className="type-list">
            {types?.map((item, index) => (
              <div
                className={`type ${type === item.name ? 'selected' : ''}`}
                key={index}
                onClick={() => setType(item.name)}
              >
                <div className="type_text">
                  <h4>{item.name}</h4>
                  <p>{item.description}</p>
                </div>
                <div className="type_icon">{item.icon}</div>
              </div>
            ))}
          </div>

          <h3>Where's your place located?</h3>
          <div className="full">
            <div className="location">
              <p>Street Address</p>
              <input name="streetAddress" value={formLocation.streetAddress} onChange={handleChangeLocation} />
            </div>
          </div>

          <div className="half">
            <div className="location">
              <p>Apartment, Suite, etc. (if applicable)</p>
              <input name="aptSuite" value={formLocation.aptSuite} onChange={handleChangeLocation} />
            </div>
            <div className="location">
              <p>City</p>
              <input name="city" value={formLocation.city} onChange={handleChangeLocation} />
            </div>
          </div>

          <div className="half">
            <div className="location">
              <p>Province</p>
              <input name="province" value={formLocation.province} onChange={handleChangeLocation} />
            </div>
            <div className="location">
              <p>Country</p>
              <input name="country" value={formLocation.country} onChange={handleChangeLocation} />
            </div>
          </div>

          <h3>Share some basics about your place</h3>
          <div className="basics">
            <div className="basic">
              <p>Guests</p>
              <div className="basic_count">
                <RemoveCircleOutline onClick={() => guestCount > 1 && setGuestCount(guestCount - 1)} />
                <p>{guestCount}</p>
                <AddCircleOutline onClick={() => setGuestCount(guestCount + 1)} />
              </div>
            </div>

            <div className="basic">
              <p>Bedrooms</p>
              <div className="basic_count">
                <RemoveCircleOutline onClick={() => bedroomCount > 1 && setBedroomCount(bedroomCount - 1)} />
                <p>{bedroomCount}</p>
                <AddCircleOutline onClick={() => setBedroomCount(bedroomCount + 1)} />
              </div>
            </div>

            <div className="basic">
              <p>Beds</p>
              <div className="basic_count">
                <RemoveCircleOutline onClick={() => bedCount > 1 && setBedCount(bedCount - 1)} />
                <p>{bedCount}</p>
                <AddCircleOutline onClick={() => setBedCount(bedCount + 1)} />
              </div>
            </div>

            <div className="basic">
              <p>Bathrooms</p>
              <div className="basic_count">
                <RemoveCircleOutline onClick={() => bathroomCount > 1 && setBathroomCount(bathroomCount - 1)} />
                <p>{bathroomCount}</p>
                <AddCircleOutline onClick={() => setBathroomCount(bathroomCount + 1)} />
              </div>
            </div>
          </div>
        </div>

        <div className="create-listing_step2">
          <h2>Step 2: Make your place stand out</h2>
          <hr />

          <h3>Tell guests what your place has to offer</h3>
          <div className="amenities">
            {facilities?.map((item, index) => (
              <div className={`facility ${amenities.includes(item.name) ? 'selected' : ''}`} key={index} onClick={() => handleSelectAmenities(item.name)}>
                <div className="facility_icon">{item.icon}</div>
                <p>{item.name}</p>
              </div>
            ))}
          </div>

          <h3>Photos</h3>
          <div className="photos">
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              {existingPhotos.map((p, idx) => (
                <div key={idx} style={{ position: 'relative' }}>
                  <img src={getImageUrl(p)} alt="existing" style={{ width: 140, height: 100, objectFit: 'cover' }} />
                  <button type="button" onClick={() => handleRemoveExisting(idx)} style={{ position: 'absolute', top: 4, right: 4 }}>Remove</button>
                </div>
              ))}
            </div>

            <div style={{ marginTop: 10 }}>
              <input id="imageAdditional" type="file" style={{ display: 'none' }} accept="image/*" onChange={handleUploadPhotos} multiple />
              <label htmlFor="imageAdditional" className="together">
                <div className="icon"><IoIosImages /></div>
                <p>Upload new photos</p>
              </label>

              <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
                {photoUrls.map((u, i) => (
                  <div key={i} style={{ position: 'relative' }}>
                    <img src={u} alt={`new-${i}`} style={{ width: 140, height: 100, objectFit: 'cover' }} />
                    <button type="button" onClick={() => handleRemoveNew(i)} style={{ position: 'absolute', top: 4, right: 4 }}>Remove</button>
                  </div>
                ))}
              </div>
            </div>

          </div>

          <h3>What make your place attractive and exciting?</h3>
          <div className="description">
            <p>Title</p>
            <input name="title" value={formDescription.title} onChange={handleChangeDescription} />
            <p>Description</p>
            <textarea name="description" value={formDescription.description} onChange={handleChangeDescription} />
            <p>Highlight</p>
            <input name="highlight" value={formDescription.highlight} onChange={handleChangeDescription} />
            <p>Highlight details</p>
            <textarea name="highlightDesc" value={formDescription.highlightDesc} onChange={handleChangeDescription} />
            <p>Now, set your PRICE</p>
            <span>$</span>
            <input name="price" type="number" value={formDescription.price} onChange={handleChangeDescription} className="price" />
          </div>
        </div>

        <button className="submit_btn" type="submit">UPDATE LISTING</button>
      </form>
    </div>
  );
};

export default EditListing;
