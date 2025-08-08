import React from 'react';

const reasons = [
  {
    title: 'Eliminate Paper Waste',
    description: 'Go completely digital and reduce environmental impact',
  },
  {
    title: 'Faster Processing',
    description: 'Instant data capture and immediate access to patient information',
  },
  {
    title: 'Error Reduction',
    description: 'Built-in validation prevents common data entry mistakes',
  },
  {
    title: 'Better Organization',
    description: 'Search, sort, and manage patient records with ease',
  },
];

const WhyChoose = () => {
  return (
    <div className='bloc_why_choose'>
   <div className="why-choose-container">
      <div className="why-left">
        <h2>Why Choose Our Digital System?</h2>
        <ul>
          {reasons.map((reason, idx) => (
            <li key={idx}>
              <i className="pi pi-check-circle"></i>
              <div>
                <strong>{reason.title}</strong>
                <p>{reason.description}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="why-right">
        <div className="card">
          <i className="pi pi-clock"></i>
          <h3>Save Time Daily</h3>
          <p>
            Reduce patient registration time from 10 minutes to just 2 minutes with our streamlined digital process.
          </p>
          <div className="savings">
            <span className="percent">80%</span>
            <span className="label">Time Savings</span>
          </div>
        </div>
      </div>
    </div>


    </div>  
   
  );
};

export default WhyChoose;
