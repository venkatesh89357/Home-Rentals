import { useEffect, useState } from "react";
import "../styles/ListingDetails.scss";
import "react-date-range/dist/theme/default.css";
import "react-date-range/dist/styles.css";
import { facilities } from "../data";
import { getImageUrl } from "../utils/image";

import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { DateRange } from "react-date-range";
import Loader from "../components/Loader";

const ListingDetails = () => {
  const [loading, setLoading] = useState(true);

  const { listingId } = useParams();
  const [listing, setListing] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");

  const getListingDetails = async () => {
    try {
      const response = await fetch(
        `http://localhost:8000/properties/${listingId}`,
        {
          method: "GET",
        }
      );

      console.log('Listing details response status:', response.status);

      if (!response.ok) {
        const text = await response.text();
        const msg = `Failed to fetch listing details: ${response.status} ${text}`;
        console.error(msg);
        setErrorMsg(msg);
        setLoading(false);
        return;
      }

      let data;
      try {
        data = await response.json();
      } catch (e) {
        const txt = await response.text();
        console.error('Invalid JSON from listing details:', txt);
        setLoading(false);
        return;
      }

      setListing(data);
      setLoading(false);
    } catch (err) {
      console.log("Fetch Listing Details Failed", err.message);
      setErrorMsg(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    getListingDetails();
  }, []);

  console.log(listing);

  /* BOOKING CALENDAR */
  const [dateRange, setDateRange] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);

  const handleSelect = (ranges) => {
    setDateRange([ranges.selection]);
  };

  const start = new Date(dateRange[0].startDate);
  const end = new Date(dateRange[0].endDate);
  const dayCount = Math.round((end - start) / (1000 * 60 * 60 * 24));

  const customerId = useSelector((state) => state?.user?._id);
  const token = useSelector((state) => state?.token);

  const navigate = useNavigate();

  const handleSubmit = async () => {
    try {
      if (!token || !customerId) {
        alert("Please log in to book a property");
        navigate("/login");
        return;
      }

      const bookingForm = {
        customerId,
        listingId,
        hostId: listing.creator._id,
        startDate: dateRange[0].startDate.toDateString(),
        endDate: dateRange[0].endDate.toDateString(),
        totalPrice: listing.price * dayCount,
      };

      const response = await fetch("http://localhost:8000/bookings/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(bookingForm),
      });

      const result = await response.json();

      if (!response.ok) {
        alert(result.message || "Booking failed. Please try again.");
        return;
      }

      if (response.ok) {
        alert("Booking successful!");
        navigate(`/${customerId}/trips`);
      }
    } catch (err) {
      alert("Booking failed: " + err.message);
      console.log("Submit Booking Failed.", err.message);
    }
  };

  if (loading) return <Loader />;
  if (errorMsg) return (
    <div style={{ padding: 40 }}>
      <h2>Failed to load listing</h2>
      <p style={{ color: 'red' }}>{errorMsg}</p>
    </div>
  );
  if (!listing) return (
    <div style={{ padding: 40 }}>
      <h2>Listing not available</h2>
      <p>Unable to load listing data.</p>
    </div>
  );

  return (
    <>

      <div className="listing-details">
        <div className="title">
          <h1>{listing.title}</h1>
          <div></div>
        </div>

        <div className="photos">
          {listing.listingPhotoPaths?.map((item) => (
            <img src={getImageUrl(item)} alt="listing photo" />
          ))}
        </div>

        <h2>
          {listing.type} in {listing.city}, {listing.province},{" "}
          {listing.country}
        </h2>
        <p>
          {listing.guestCount} guests - {listing.bedroomCount} bedroom(s) -{" "}
          {listing.bedCount} bed(s) - {listing.bathroomCount} bathroom(s)
        </p>
        <hr />

        <div className="profile">
          <img src={getImageUrl(listing.creator.profileImagePath)} />
          <h3>
            Hosted by {listing.creator.firstName} {listing.creator.lastName}
          </h3>
        </div>
        <hr />

        <h3>Description</h3>
        <p>{listing.description}</p>
        <hr />

        <h3>{listing.highlight}</h3>
        <p>{listing.highlightDesc}</p>
        <hr />

        <div className="booking">
          <div>
            <h2>What this place offers?</h2>
            <div className="amenities">
              {(() => {
                // Normalize amenities: accept either an array or a comma-separated string
                let amenitiesList = [];
                if (Array.isArray(listing.amenities)) {
                  amenitiesList = listing.amenities;
                } else if (typeof listing.amenities === 'string') {
                  amenitiesList = listing.amenities.split(',');
                }

                return amenitiesList.map((rawItem, index) => {
                  const item = String(rawItem).trim();
                  const icon = facilities.find((f) => f.name === item)?.icon;
                  return (
                    <div className="facility" key={index}>
                      <div className="facility_icon">{icon}</div>
                      <p>{item}</p>
                    </div>
                  );
                });
              })()}
            </div>
          </div>

          <div>
            <h2>How long do you want to stay?</h2>
            <div className="date-range-calendar">
              <DateRange ranges={dateRange} onChange={handleSelect} />
              {dayCount > 1 ? (
                <h2>
                  ${listing.price} x {dayCount} nights
                </h2>
              ) : (
                <h2>
                  ${listing.price} x {dayCount} night
                </h2>
              )}

              <h2>Total price: ${listing.price * dayCount}</h2>
              <p>Start Date: {dateRange[0].startDate.toDateString()}</p>
              <p>End Date: {dateRange[0].endDate.toDateString()}</p>

              <button className="button" type="submit" onClick={handleSubmit}>
                BOOKING
              </button>
            </div>
          </div>
        </div>
      </div>

    </>
  );
};

export default ListingDetails;
