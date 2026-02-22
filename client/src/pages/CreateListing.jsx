import "../styles/CreateListing.scss";
import { categories, types, facilities } from "../data";

import { RemoveCircleOutline, AddCircleOutline } from "@mui/icons-material";
//import variables from "../styles/variables.scss";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { IoIosImages } from "react-icons/io";
import { useState, useEffect } from "react";
import { BiTrash } from "react-icons/bi";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../config/api";

const CreateListing = () => {
  const [category, setCategory] = useState("");
  const [type, setType] = useState("");
  const [guestCount, setGuestCount] = useState(1);
  const [bedroomCount, setBedroomCount] = useState(1);
  const [bedCount, setBedCount] = useState(1);
  const [bathroomCount, setBathroomCount] = useState(1);

  const [amenities, setAmenities] = useState([]);

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
  const [loading, setLoading] = useState(false);

  const creatorId = useSelector((state) => state.user._id);
  const token = useSelector((state) => state.token);

  const navigate = useNavigate();

  // Cleanup object URLs on unmount
  useEffect(() => {
    return () => {
      photoUrls.forEach(url => URL.revokeObjectURL(url));
    };
  }, []);

  const handleChangeLocation = (e) => {
    const { name, value } = e.target;
    setFormLocation({
      ...formLocation,
      [name]: value,
    });
  };

  const handleSelectAmenities = (facility) => {
    if (amenities.includes(facility)) {
      setAmenities((prevAmenities) =>
        prevAmenities.filter((option) => option !== facility)
      );
    } else {
      setAmenities((prev) => [...prev, facility]);
    }
  };

  const handleUploadPhotos = (e) => {
    const newPhotos = Array.from(e.target.files || []);
    if (newPhotos.length === 0) {
      console.log("No photos selected");
      return;
    }
    
    console.log("Photos selected:", newPhotos.length);
    
    setPhotos((prevPhotos) => {
      const updatedPhotos = [...prevPhotos, ...newPhotos];
      console.log("Total photos now:", updatedPhotos.length);
      return updatedPhotos;
    });

    // Create preview URLs - make sure they're valid
    const newUrls = newPhotos.map((file) => {
      const url = URL.createObjectURL(file);
      console.log("Created preview URL for:", file.name, "URL:", url);
      return url;
    });
    
    setPhotoUrls((prevUrls) => {
      const updatedUrls = [...prevUrls, ...newUrls];
      console.log("Total preview URLs now:", updatedUrls.length);
      return updatedUrls;
    });

    // Clear file input to allow re-uploading same file
    e.target.value = "";
  };

  const handleDragPhoto = (result) => {
    if (!result.destination) return;

    const items = Array.from(photos);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setPhotos(items);

    // Reorder photo URLs
    const urlItems = Array.from(photoUrls);
    const [reorderedUrl] = urlItems.splice(result.source.index, 1);
    urlItems.splice(result.destination.index, 0, reorderedUrl);
    setPhotoUrls(urlItems);
  };

  const handleRemovePhoto = (indexToRemove) => {
    setPhotos((prevPhotos) =>
      prevPhotos.filter((_, index) => index !== indexToRemove)
    );

    // Revoke and remove the URL
    URL.revokeObjectURL(photoUrls[indexToRemove]);
    setPhotoUrls((prevUrls) =>
      prevUrls.filter((_, index) => index !== indexToRemove)
    );
  };

  const handleChangeDescription = (e) => {
    const { name, value } = e.target;
    setFormDescription({
      ...formDescription,
      [name]: value,
    });
  };

  const resetForm = () => {
    setCategory("");
    setType("");
    setGuestCount(1);
    setBedroomCount(1);
    setBedCount(1);
    setBathroomCount(1);
    setAmenities([]);
    setPhotos([]);
    photoUrls.forEach(url => URL.revokeObjectURL(url));
    setPhotoUrls([]);
    setFormLocation({
      streetAddress: "",
      aptSuite: "",
      city: "",
      province: "",
      country: "",
    });
    setFormDescription({
      title: "",
      description: "",
      highlight: "",
      highlightDesc: "",
      price: 0,
    });
    setError("");
  };

  const handlePost = async (e) => {
    e.preventDefault();
    setError("");

    // Validation
    if (!category || !type) {
      setError("Please select category and type");
      return;
    }

    if (!formLocation.streetAddress || !formLocation.city || !formLocation.province || !formLocation.country) {
      setError("Please fill in all location fields (except Apt/Suite)");
      return;
    }

    if (!formDescription.title || !formDescription.description || !formDescription.price) {
      setError("Please fill in title, description, and price");
      return;
    }

    if (photos.length === 0) {
      setError("Please upload at least one photo");
      return;
    }

    if (!creatorId || !token) {
      setError("Please log in first");
      navigate("/login");
      return;
    }

    setLoading(true);

    try {
      const listingForm = new FormData();
      listingForm.append("creator", creatorId);
      listingForm.append("category", category);
      listingForm.append("type", type);
      listingForm.append("streetAddress", formLocation.streetAddress);
      listingForm.append("aptSuite", formLocation.aptSuite);
      listingForm.append("city", formLocation.city);
      listingForm.append("province", formLocation.province);
      listingForm.append("country", formLocation.country);
      listingForm.append("guestCount", guestCount);
      listingForm.append("bedroomCount", bedroomCount);
      listingForm.append("bedCount", bedCount);
      listingForm.append("bathroomCount", bathroomCount);
      listingForm.append("amenities", JSON.stringify(amenities));
      listingForm.append("title", formDescription.title);
      listingForm.append("description", formDescription.description);
      listingForm.append("highlight", formDescription.highlight);
      listingForm.append("highlightDesc", formDescription.highlightDesc);
      listingForm.append("price", formDescription.price);

      /* Append each selected photo to the FormData object */
      photos.forEach((photo) => {
        listingForm.append("listingPhotos", photo);
      });

      const response = await fetch(`${API_URL}/properties/create`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: listingForm,
      });

      console.log("Upload Response Status:", response.status);
      
      const result = await response.json();
      console.log("Upload Response Data:", result);

      if (!response.ok) {
        const errorMsg = result.message || result.error || "Failed to create listing";
        console.log("Upload Error:", errorMsg);
        setError(errorMsg);
        setLoading(false);
        return;
      }

      if (response.ok) {
        console.log("Listing created successfully!");
        resetForm();
        navigate("/");
      }
    } catch (err) {
      console.log("Upload Exception:", err);
      setError("Publish Listing failed: " + err.message);
      console.log("Publish Listing failed", err.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <div className="create-listing">
        <h1>Publish Your Place</h1>
        {error && <p style={{ color: "red", padding: "10px", backgroundColor: "#ffe0e0", borderRadius: "4px", marginBottom: "20px" }}>{error}</p>}
        <form onSubmit={handlePost}>
          <div className="create-listing_step1">
            <h2>Step 1: Tell us about your place</h2>
            <hr />
            <h3>Which of these categories best describes your place?</h3>
            <div className="category-list">
              {categories?.map((item, index) => (
                <div
                  className={`category ${
                    category === item.label ? "selected" : ""
                  }`}
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
                  className={`type ${type === item.name ? "selected" : ""}`}
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
                <input
                  type="text"
                  placeholder="Street Address"
                  name="streetAddress"
                  value={formLocation.streetAddress}
                  onChange={handleChangeLocation}
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div className="half">
              <div className="location">
                <p>Apartment, Suite, etc. (if applicable)</p>
                <input
                  type="text"
                  placeholder="Apt, Suite, etc. (if applicable)"
                  name="aptSuite"
                  value={formLocation.aptSuite}
                  onChange={handleChangeLocation}
                  required
                  disabled={loading}
                />
              </div>
              <div className="location">
                <p>City</p>
                <input
                  type="text"
                  placeholder="City"
                  name="city"
                  value={formLocation.city}
                  onChange={handleChangeLocation}
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div className="half">
              <div className="location">
                <p>Province</p>
                <input
                  type="text"
                  placeholder="Province"
                  name="province"
                  value={formLocation.province}
                  onChange={handleChangeLocation}
                  required
                  disabled={loading}
                />
              </div>
              <div className="location">
                <p>Country</p>
                <input
                  type="text"
                  placeholder="Country"
                  name="country"
                  value={formLocation.country}
                  onChange={handleChangeLocation}
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <h3>Share some basics about your place</h3>
            <div className="basics">
              <div className="basic">
                <p>Guests</p>
                <div className="basic_count">
                  <RemoveCircleOutline
                    onClick={() => {
                      guestCount > 1 && setGuestCount(guestCount - 1);
                    }}
                    sx={{
                      fontSize: "25px",
                      cursor: "pointer",
                      "&:hover": { color: "#F8395A" },
                    }}
                  />
                  <p>{guestCount}</p>
                  <AddCircleOutline
                    onClick={() => {
                      setGuestCount(guestCount + 1);
                    }}
                    sx={{
                      fontSize: "25px",
                      cursor: "pointer",
                      "&:hover": { color: "#F8395A" },
                    }}
                  />
                </div>
              </div>

              <div className="basic">
                <p>Bedrooms</p>
                <div className="basic_count">
                  <RemoveCircleOutline
                    onClick={() => {
                      bedroomCount > 1 && setBedroomCount(bedroomCount - 1);
                    }}
                    sx={{
                      fontSize: "25px",
                      cursor: "pointer",
                      "&:hover": { color: "#F8395A" },
                    }}
                  />
                  <p>{bedroomCount}</p>
                  <AddCircleOutline
                    onClick={() => {
                      setBedroomCount(bedroomCount + 1);
                    }}
                    sx={{
                      fontSize: "25px",
                      cursor: "pointer",
                      "&:hover": { color: "#F8395A" },
                    }}
                  />
                </div>
              </div>

              <div className="basic">
                <p>Beds</p>
                <div className="basic_count">
                  <RemoveCircleOutline
                    onClick={() => {
                      bedCount > 1 && setBedCount(bedCount - 1);
                    }}
                    sx={{
                      fontSize: "25px",
                      cursor: "pointer",
                      "&:hover": { color: "#F8395A" },
                    }}
                  />
                  <p>{bedCount}</p>
                  <AddCircleOutline
                    onClick={() => {
                      setBedCount(bedCount + 1);
                    }}
                    sx={{
                      fontSize: "25px",
                      cursor: "pointer",
                      "&:hover": { color: "#F8395A" },
                    }}
                  />
                </div>
              </div>

              <div className="basic">
                <p>Bathrooms</p>
                <div className="basic_count">
                  <RemoveCircleOutline
                    onClick={() => {
                      bathroomCount > 1 && setBathroomCount(bathroomCount - 1);
                    }}
                    sx={{
                      fontSize: "25px",
                      cursor: "pointer",
                      "&:hover": { color: "#F8395A" },
                    }}
                  />
                  <p>{bathroomCount}</p>
                  <AddCircleOutline
                    onClick={() => {
                      setBathroomCount(bathroomCount + 1);
                    }}
                    sx={{
                      fontSize: "25px",
                      cursor: "pointer",
                      "&:hover": { color: "#F8395A" },
                    }}
                  />
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
                <div
                  className={`facility ${
                    amenities.includes(item.name) ? "selected" : ""
                  }`}
                  key={index}
                  onClick={() => handleSelectAmenities(item.name)}
                >
                  <div className="facility_icon">{item.icon}</div>
                  <p>{item.name}</p>
                </div>
              ))}
            </div>

            <h3>Add some photos of your place</h3>
            <DragDropContext onDragEnd={handleDragPhoto}>
              <Droppable droppableId="photos" direction="horizontal">
                {(provided) => (
                  <div
                    className="photos"
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                  >
                    {photos.length < 1 && (
                      <>
                        <input
                          id="imageInitial"
                          type="file"
                          style={{ display: "none" }}
                          accept="image/*"
                          onChange={handleUploadPhotos}
                          multiple
                          disabled={loading}
                        />
                        <label htmlFor="imageInitial" className="alone">
                          <div className="icon">
                            <IoIosImages />
                          </div>
                          <p>Upload from your device</p>
                        </label>
                      </>
                    )}

                    {photos.length >= 1 && (
                      <>
                        {photos.map((photo, index) => {
                          const photoUrl = photoUrls[index];
                          console.log(`Photo ${index}:`, photo.name, "URL:", photoUrl);
                          return (
                            <Draggable
                              key={index}
                              draggableId={`photo-${index}`}
                              index={index}
                            >
                              {(provided) => (
                                <div
                                  className="photo"
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                >
                                  {photoUrl ? (
                                    <img
                                      src={photoUrl}
                                      alt={`place ${index + 1}`}
                                      onError={() => console.log(`Image failed to load: ${photoUrl}`)}
                                      onLoad={() => console.log(`Image loaded: ${photoUrl}`)}
                                    />
                                  ) : (
                                    <div style={{ background: "#ccc", width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                      Loading...
                                    </div>
                                  )}
                                  <button
                                    type="button"
                                    onClick={() => handleRemovePhoto(index)}
                                    disabled={loading}
                                  >
                                    <BiTrash />
                                  </button>
                                </div>
                              )}
                            </Draggable>
                          );
                        })}
                        <input
                          id="imageAdditional"
                          type="file"
                          style={{ display: "none" }}
                          accept="image/*"
                          onChange={handleUploadPhotos}
                          multiple
                          disabled={loading}
                        />
                        <label htmlFor="imageAdditional" className="together">
                          <div className="icon">
                            <IoIosImages />
                          </div>
                          <p>Upload from your device</p>
                        </label>
                      </>
                    )}
                  </div>
                )}
              </Droppable>
            </DragDropContext>

            <h3>What make your place attractive and exciting?</h3>
            <div className="description">
              <p>Title</p>
              <input
                type="text"
                placeholder="Title"
                name="title"
                value={formDescription.title}
                onChange={handleChangeDescription}
                required
                disabled={loading}
              />
              <p>Description</p>
              <textarea
                type="text"
                placeholder="Description"
                name="description"
                value={formDescription.description}
                onChange={handleChangeDescription}
                required
                disabled={loading}
              />
              <p>Highlight</p>
              <input
                type="text"
                placeholder="Highlight"
                name="highlight"
                value={formDescription.highlight}
                onChange={handleChangeDescription}
                required
                disabled={loading}
              />
              <p>Highlight details</p>
              <textarea
                type="text"
                placeholder="Highlight details"
                name="highlightDesc"
                value={formDescription.highlightDesc}
                onChange={handleChangeDescription}
                required
                disabled={loading}
              />
              <p>Now, set your PRICE</p>
              <span>$</span>
              <input
                type="number"
                placeholder="100"
                name="price"
                value={formDescription.price}
                onChange={handleChangeDescription}
                className="price"
                required
                disabled={loading}
              />
            </div>
          </div>

          <button className="submit_btn" type="submit" disabled={loading}>
            {loading ? "CREATING..." : "CREATE YOUR LISTING"}
          </button>
        </form>
      </div>
    </>
  );
};

export default CreateListing;
