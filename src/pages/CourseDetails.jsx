import { useEffect, useState, useCallback, useMemo } from "react";
import { Link, useNavigate, useParams, useLocation } from "react-router-dom";
import { getCourseBySlug } from "../api/courses.api.js";
import { normalizeCourse } from "../utils/apiDefaults.js";
import {
  registerForCourse,
  getUserCourseRegistration,
} from "../api/courseRegistration.api.js";
import { useAuth } from "../contexts/AuthContext.jsx";
import { toAbsoluteMediaUrl } from "../utils/mediaUrl.js";
import PageHero from "../components/PageHero";
import PageLoader from "../components/PageLoader";
import PaymentComingSoonModal from "../components/modals/PaymentComingSoonModal";
import aprilImage from "../assets/APRIL.jpeg";
import marchImage from "../assets/MARCH.jpeg";
import "../styles/course-details.css";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

/** Local calendar day key YYYY-MM-DD (no timezone shift for calendar tiles). */
function toLocalDateKey(date) {
  if (!(date instanceof Date) || Number.isNaN(date.getTime())) return null;
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function parseCourseScheduleDates(course) {
  const raw =
    course?.availableDates ??
    course?.scheduleDates ??
    course?.openDates ??
    null;
  if (!Array.isArray(raw) || raw.length === 0) return new Set();
  const keys = new Set();
  for (const item of raw) {
    let d = null;
    if (item instanceof Date) d = item;
    else if (typeof item === "string" || typeof item === "number") {
      d = new Date(item);
    } else if (item && typeof item === "object") {
      const s = item.date ?? item.startDate ?? item.day ?? item.isoDate;
      if (s != null) d = new Date(s);
    }
    const key = d && toLocalDateKey(d);
    if (key) keys.add(key);
  }
  return keys;
}

function keyToLocalDate(key) {
  const [y, m, day] = key.split("-").map(Number);
  if (!y || !m || !day) return null;
  return new Date(y, m - 1, day);
}

/** YYYY-MM-DD lexicographic order matches chronological order. */
function isDateKeyInRange(key, minKey, maxKey) {
  if (!key || !minKey || !maxKey) return false;
  return key >= minKey && key <= maxKey;
}

function registrationSessionKey(reg) {
  if (!reg) return null;
  const k = reg.sessionDateKey;
  if (k != null && String(k).trim()) return String(k).trim();
  if (reg.sessionDate) {
    const d = new Date(reg.sessionDate);
    return toLocalDateKey(d);
  }
  return null;
}



function CourseDetails() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const [activePayment, setActivePayment] = useState("visit");
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [registering, setRegistering] = useState(false);
  const [registrationMessage, setRegistrationMessage] = useState("");
  const [registration, setRegistration] = useState(null);
  const [checkingRegistration, setCheckingRegistration] = useState(false);
  const [scheduleLightbox, setScheduleLightbox] = useState(null); // 'april' | 'march' | null

  const [selectedDate, setSelectedDate] = useState(null);
  const [calendarMonth, setCalendarMonth] = useState(() => new Date());
  const [registerModalOpen, setRegisterModalOpen] = useState(false);
  const [registerModalDateKey, setRegisterModalDateKey] = useState(null);
  const checkRegistrationStatus = useCallback(
    async (courseId) => {
      if (!isAuthenticated || !courseId) {
        setRegistration(null);
        setCheckingRegistration(false);
        return;
      }

      // Set a timeout to ensure checkingRegistration always resets
      const timeoutId = setTimeout(() => {
        setCheckingRegistration(false);
      }, 10000); // 10 second timeout

      try {
        setCheckingRegistration(true);
        const reg = await getUserCourseRegistration(courseId);
        clearTimeout(timeoutId);
        // Set registration (null means not registered, object means registered)
        setRegistration(reg || null);
      } catch (err) {
        clearTimeout(timeoutId);
        console.error("Failed to check registration status:", err);
        // On any error, assume not registered
        setRegistration(null);
      } finally {
        // Always set checking to false
        setCheckingRegistration(false);
      }
    },
    [isAuthenticated],
  );

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, [slug]);

  useEffect(() => {
    async function loadCourse() {
      if (!slug) {
        navigate("/courses");
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const data = await getCourseBySlug(slug);
        setCourse(data);

        // Check registration status if user is authenticated
        if (isAuthenticated && data?._id) {
          checkRegistrationStatus(data._id);
        }
      } catch (err) {
        console.error("Failed to load course:", err);
        // Fix: fallback to safe defaults if API fails or returns missing data.
        const fallback = normalizeCourse(location.state?.course || null);
        setCourse(fallback);
        // When we have a fallback, avoid blocking render with error UI.
        setError(
          fallback
            ? null
            : err.response?.status === 404
              ? "Course not found"
              : "Failed to load course",
        );
      } finally {
        setLoading(false);
      }
    }

    loadCourse();
  }, [
    slug,
    navigate,
    isAuthenticated,
    checkRegistrationStatus,
    location.state,
  ]);

  // Refresh registration status when user authentication changes
  useEffect(() => {
    if (!isAuthenticated) {
      setRegistration(null);
      setCheckingRegistration(false);
      return;
    }

    if (course?._id && !checkingRegistration) {
      checkRegistrationStatus(course._id);
    }
  }, [isAuthenticated, course?._id, checkRegistrationStatus]);

  const {
    availableDateKeys,
    restrictToAvailable,
    minDate,
    maxDate,
    rangeMinKey,
    rangeMaxKey,
  } = useMemo(() => {
    const keys = parseCourseScheduleDates(course);
    if (keys.size === 0) {
      return {
        availableDateKeys: keys,
        restrictToAvailable: false,
        minDate: undefined,
        maxDate: undefined,
        rangeMinKey: undefined,
        rangeMaxKey: undefined,
      };
    }
    const sorted = [...keys].sort();
    return {
      availableDateKeys: keys,
      restrictToAvailable: true,
      minDate: keyToLocalDate(sorted[0]),
      maxDate: keyToLocalDate(sorted[sorted.length - 1]),
      rangeMinKey: sorted[0],
      rangeMaxKey: sorted[sorted.length - 1],
    };
  }, [course]);

  useEffect(() => {
    if (!course?._id) return;
    if (!restrictToAvailable || !minDate) {
      setCalendarMonth(new Date());
      if (!registration) setSelectedDate(null);
      return;
    }
    const regKey = registrationSessionKey(registration);
    if (regKey) {
      const d = keyToLocalDate(regKey);
      if (d) {
        setCalendarMonth(d);
        setSelectedDate(d);
        return;
      }
    }
    setCalendarMonth(minDate);
    setSelectedDate(minDate);
  }, [
    course?._id,
    restrictToAvailable,
    minDate,
    maxDate,
    registration?.sessionDateKey,
    registration?.sessionDate,
    registration?._id,
  ]);

  const handlePaymentClick = (type) => {
    if (type === "mastercard") {
      setIsPaymentModalOpen(true);
      return;
    }
    setActivePayment(type);
  };

  const handleRegister = async (sessionDateKey) => {
    if (!isAuthenticated) {
      navigate("/login", { state: { from: `/courses/${slug}` } });
      return;
    }

    if (!course?._id) {
      setRegistrationMessage("Course information is missing");
      return;
    }

    setRegistering(true);
    setRegistrationMessage("");

    try {
      const newRegistration = await registerForCourse(
        course._id,
        sessionDateKey || undefined,
      );
      // Ensure registration has status field and proper structure
      if (newRegistration) {
        if (!newRegistration.status) {
          newRegistration.status = "pending";
        }
        setRegistration(newRegistration);
        setRegistrationMessage(
          "Successfully registered for this course! Status: Pending",
        );
      } else {
        // If registration failed but no error thrown, refresh status
        await checkRegistrationStatus(course._id);
        setRegistrationMessage("Registration completed. Checking status...");
      }
      // Clear message after 5 seconds
      setRegisterModalOpen(false);
      setRegisterModalDateKey(null);
      setTimeout(() => setRegistrationMessage(""), 5000);
    } catch (err) {
      if (err.message.includes("already registered")) {
        // Refresh registration status
        await checkRegistrationStatus(course._id);
        setRegistrationMessage("You are already registered for this course");
        setTimeout(() => setRegistrationMessage(""), 5000);
      } else {
        setRegistrationMessage(
          err.message || "Failed to register. Please try again.",
        );
      }
    } finally {
      setRegistering(false);
    }
  };

  const handleCalendarDayChange = (date) => {
    setSelectedDate(date);
    if (!restrictToAvailable || !rangeMinKey || !rangeMaxKey) return;
    const key = toLocalDateKey(date);
    if (!key || !isDateKeyInRange(key, rangeMinKey, rangeMaxKey)) return;
    setRegistrationMessage("");
    setRegisterModalDateKey(key);
    setRegisterModalOpen(true);
  };

  const registeredKeyForCalendar = registrationSessionKey(registration);

  const getStatusDisplay = (status) => {
    switch (status) {
      case "paid":
        return {
          text: "Paid ✓",
          className: "status-paid",
        };
      case "pending":
        return {
          text: "Pending",
          className: "status-pending",
        };
      case "rejected":
        return {
          text: "Rejected",
          className: "status-rejected",
        };
      default:
        return {
          text: "Unknown",
          className: "",
        };
    }
  };

  if (loading) {
    return <PageLoader isVisible={true} />;
  }

  if (error || !course) {
    return (
      <section className="course-detail-page" dir="rtl">
        <div className="course-detail-container">
          <h1 className="course-detail-title">Course not found</h1>
          <p className="course-detail-lead">
            {error ||
              "Course details not found. Please return to the course catalog."}
          </p>
          <Link className="course-back-button" to="/courses">
            Back to Course Catalog
          </Link>
        </div>
      </section>
    );
  }

  const imageUrl = course.imageUrl ? toAbsoluteMediaUrl(course.imageUrl) : "";

  return (
    <section className="course-detail-page" dir="rtl">
      <PageHero
        title={course.title}
        subtitle={course.shortDescription || undefined}
        backgroundImage={imageUrl}
        breadcrumbs={[
          { label: "Courses", path: "/courses" },
          { label: course.title, path: "#" },
        ]}
      />
      <div className="course-detail-container">
        <div className="course-detail-layout">
          <div className="course-detail-main">
            {/* Registration Status Section */}
            <div style={{ marginBottom: "24px" }}>
              {isAuthenticated ? (
                <>
                  {checkingRegistration ? (
                    <div style={{ padding: "12px", color: "var(--color-primary-green)", fontSize: "14px", fontWeight: "600" }}>
                      <i className="fas fa-circle-notch fa-spin" style={{ marginRight: "8px" }}></i>
                      Checking registration status...
                    </div>
                  ) : registration ? (
                    <div style={{ marginBottom: "16px" }}>
                      <div className={`registration-status-banner ${getStatusDisplay(registration.status || "pending").className}`}>
                        <span>Registration Status:</span>
                        <span className="status-badge">
                          {getStatusDisplay(registration.status || "pending").text}
                        </span>
                      </div>
                      {registration.notes && (
                        <div className="registration-note">
                          <strong>Note:</strong> {registration.notes}
                        </div>
                      )}
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleRegister()}
                      disabled={registering}
                      className="course-register-button"
                    >
                      {registering ? "Registering..." : "Register for Course"}
                    </button>
                  )}
                  {registrationMessage && (
                    <div
                      style={{
                        marginTop: "12px",
                        padding: "12px",
                        borderRadius: "8px",
                        backgroundColor: registration ? "#d1fae5" : "#fee2e2",
                        color: registration ? "#065f46" : "#991b1b",
                        fontSize: "14px",
                      }}
                    >
                      {registrationMessage}
                    </div>
                  )}
                </>
              ) : (
                <button
                  type="button"
                  onClick={() => navigate("/login", { state: { from: `/courses/${slug}` } })}
                  className="course-register-button"
                >
                  Login to Register
                </button>
              )}
            </div>

            {course.description && (
              <div className="course-detail-content">
                <div
                  className="course-detail-paragraph"
                  style={{ whiteSpace: "pre-line" }}
                >
                  {course.description}
                </div>
              </div>
            )}

            <div className="course-payments">
              <h2 className="course-detail-heading">Payment Methods</h2>
              <div className="course-payment-grid">
                <button
                  type="button"
                  className="payment-card"
                  onClick={() => handlePaymentClick("mastercard")}
                  aria-label="Pay with MasterCard"
                >
                  <span className="payment-icon" aria-hidden="true">
                    MC
                  </span>
                  <span className="payment-title">MasterCard</span>
                  <span className="payment-subtitle">
                    Go to the payment page
                  </span>
                </button>
                <button
                  type="button"
                  className={`payment-card ${
                    activePayment === "visit" ? "is-active" : ""
                  }`}
                  onClick={() => handlePaymentClick("visit")}
                  aria-label="Pay by visiting the center"
                  aria-pressed={activePayment === "visit"}
                >
                  <span className="payment-icon" aria-hidden="true">
                    VC
                  </span>
                  <span className="payment-title">
                    Pay by visiting the center
                  </span>
                  <span className="payment-subtitle">
                    Address and contact details
                  </span>
                </button>
                <button
                  type="button"
                  className={`payment-card ${
                    activePayment === "bank" ? "is-active" : ""
                  }`}
                  onClick={() => handlePaymentClick("bank")}
                  aria-label="Bank transfer"
                  aria-pressed={activePayment === "bank"}
                >
                  <span className="payment-icon" aria-hidden="true">
                    BT
                  </span>
                  <span className="payment-title">Bank transfer</span>
                  <span className="payment-subtitle">Bank account details</span>
                </button>
              </div>

              {activePayment === "visit" && (
                <div className="payment-details" role="status">
                  <h3>Visit the center</h3>
                  <p>King Fahad Ibn Abdulaziz Road</p>
                  <p>Alkhobar</p>
                  <p>Postal code: 34627</p>
                  <p>Building no: 7722</p>
                  <p>Phone: +966 55 724 5777</p>
                </div>
              )}

              {activePayment === "bank" && (
                <div className="payment-details" role="status">
                  <h3>Bank transfer</h3>
                  <p>Bank name: Bank AlJazira</p>
                  <p>Account number: 021282149993001</p>
                  <p>IBAN: SA8760100021282149993001</p>
                  <p>Account currency: SAR</p>
                </div>
              )}
            </div>
          </div>

          {/* Right Sidebar - March & April */}
          <aside className="course-detail-sidebar">
            <div className="course-sidebar-card">
              <h3 className="course-sidebar-title">Schedule</h3>
              <div className="course-sidebar-months">
                <div className="course-sidebar-month">
                  {restrictToAvailable ? (
                    <p className="course-calendar-hint">
                      Shaded range is open; session days use a stronger highlight.
                    </p>
                  ) : (
                    <p className="course-calendar-hint course-calendar-hint--muted">
                      Schedule dates will appear here when published for this
                      course.
                    </p>
                  )}
                  <Calendar
                    value={selectedDate}
                    onChange={handleCalendarDayChange}
                    defaultView="month"
                    activeStartDate={calendarMonth}
                    onActiveStartDateChange={({ activeStartDate }) =>
                      setCalendarMonth(activeStartDate)
                    }
                    minDate={minDate}
                    maxDate={maxDate}
                    tileDisabled={({ date, view }) => {
                      if (view !== "month") return false;
                      if (!restrictToAvailable) return false;
                      const key = toLocalDateKey(date);
                      if (!key) return true;
                      return !isDateKeyInRange(key, rangeMinKey, rangeMaxKey);
                    }}
                    tileClassName={({ date, view }) => {
                      if (view !== "month") return null;
                      if (!restrictToAvailable || !rangeMinKey || !rangeMaxKey) {
                        return null;
                      }
                      const key = toLocalDateKey(date);
                      if (!key) return null;
                      if (!isDateKeyInRange(key, rangeMinKey, rangeMaxKey)) {
                        return null;
                      }
                      if (
                        registeredKeyForCalendar &&
                        key === registeredKeyForCalendar
                      ) {
                        return "course-calendar-tile-registered";
                      }
                      if (availableDateKeys.has(key)) {
                        return "course-calendar-tile-available";
                      }
                      return "course-calendar-tile-in-range";
                    }}
                  />
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* Schedule image lightbox */}
      {scheduleLightbox && (
        <div
          className="course-schedule-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label="Schedule image full size"
          onClick={() => setScheduleLightbox(null)}
        >
          <button
            type="button"
            className="course-schedule-lightbox-close"
            onClick={(e) => {
              e.stopPropagation();
              setScheduleLightbox(null);
            }}
            aria-label="Close"
          >
            ×
          </button>
          <div
            className="course-schedule-lightbox-inner"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={scheduleLightbox === "april" ? aprilImage : marchImage}
              alt={
                scheduleLightbox === "april"
                  ? "Course schedule April"
                  : "Course schedule March"
              }
              className="course-schedule-lightbox-img"
            />
          </div>
        </div>
      )}

      {registerModalOpen && restrictToAvailable && (
        <div
          className="course-register-modal-backdrop"
          role="presentation"
          onClick={() => {
            if (!registering) {
              setRegisterModalOpen(false);
            }
          }}
        >
          <div
            className="course-register-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="course-register-modal-title"
            dir="ltr"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="course-register-modal-close"
              onClick={() => {
                if (!registering) setRegisterModalOpen(false);
              }}
              aria-label="Close"
              disabled={registering}
            >
              ×
            </button>
            <h2 id="course-register-modal-title" className="course-register-modal-title">
              Register for this course
            </h2>
            {registerModalDateKey && (
              <p className="course-register-modal-date">
                Selected session:{" "}
                <strong>{registerModalDateKey}</strong>
              </p>
            )}
            {registration ? (
              <div className="course-register-modal-body text-center">
                <p className="course-register-modal-info">
                  You are already registered for this course.
                </p>
                <div className={`registration-status-banner ${getStatusDisplay(registration.status || "pending").className}`} style={{ justifyContent: 'center', marginTop: '16px' }}>
                   <span className="status-badge">
                      {getStatusDisplay(registration.status || "pending").text}
                   </span>
                </div>
                {registeredKeyForCalendar && (
                  <p className="course-register-modal-meta">
                    Your session day: <strong>{registeredKeyForCalendar}</strong>
                  </p>
                )}
              </div>
            ) : !isAuthenticated ? (
              <div className="course-register-modal-actions">
                <button
                  type="button"
                  onClick={() => navigate("/login", { state: { from: `/courses/${slug}` } })}
                  className="course-register-button w-full"
                  style={{ width: '100%' }}
                >
                  Login to Register
                </button>
              </div>
            ) : (
              <div className="course-register-modal-actions">
                <button
                  type="button"
                  onClick={() => handleRegister(registerModalDateKey)}
                  disabled={registering || !registerModalDateKey}
                  className="course-register-button w-full"
                  style={{ width: '100%' }}
                >
                  {registering ? "Registering..." : "Register for Course"}
                </button>
              </div>
            )}
            {registrationMessage && (
              <div
                className={`course-register-modal-message ${registration ? "is-success" : "is-error"}`}
                role="status"
              >
                {registrationMessage}
              </div>
            )}
          </div>
        </div>
      )}

      <PaymentComingSoonModal
        open={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        courseName={course.slug}
      />
    </section>
  );
}

export default CourseDetails;
