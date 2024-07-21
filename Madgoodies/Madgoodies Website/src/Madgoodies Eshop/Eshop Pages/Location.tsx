import React from 'react';
 

const HoursLocation: React.FC = () => {
  return (
    <div className="hours-location-container">
      <h1 className="hours-location-title">Hours & Location</h1>
      <p className="hours-location-address">
        <a href="https://www.google.com/maps?q=654+S+9th+St,+Noblesville,+IN+46060" target="_blank" rel="noopener noreferrer">
          654 S 9th St (Inside the VFW), Noblesville, IN 46060
        </a>
        <br />
        463-266-0021
      </p>
      <h2>New Hours</h2>
      <p className="hours-location-closed">We will no longer be open on Thursdays.</p>
      <p>Friday: 7:30 am to 2 pm</p>
      <p>Sunday: 7:30 am to noon</p>
      <p>
        Online pre-ordering is available beginning at 8:30 am Friday & Sunday. Pick-up anytime before we close or pick up
        after hours from the VFW until 6 pm.
      </p>
      <p>Saturdays: Check our <a href="https://example.com/menu" target="_blank" rel="noopener noreferrer">menu</a> and <a href="https://example.com/socials" target="_blank" rel="noopener noreferrer">socials</a> for pop-ups</p>
      <p>Fill out our contact form <a href="https://example.com/contact" target="_blank" rel="noopener noreferrer">here</a> for special orders and catering</p>
      <iframe
        title="Location Map"
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.086276646341!2d-122.41941548468217!3d37.77492927975938!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8085808ef456ba2b%3A0x8a3c8f8b8c8b8b8!2sSan%20Francisco!5e0!3m2!1sen!2sus!4v1623429830590!5m2!1sen!2sus"
        className="hours-location-map"
        allowFullScreen={false}
        loading="lazy"
      ></iframe>
    </div>
  );
}

export default HoursLocation;
