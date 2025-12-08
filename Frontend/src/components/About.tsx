const About = () => {
  const pillars = [
    {
      title: 'Curation with intention',
      copy: 'We seek out independent perfumers and timeless classics, then build seasonal edits so you can explore with confidence.',
      points: [
        'Small-batch houses, designer icons, and discovery sets.',
        'Every release is sampled and tested before it reaches our shelves.',
        'Stored climate-safe and shipped quickly to keep every note intact.',
      ],
    },
    {
      title: 'Service that feels human',
      copy: 'Fragrance is personal. We guide you with honest notes, fit checks, and quick follow-ups once your order lands.',
      points: [
        '1:1 scent-match guidance when you need a second nose.',
        'Sample-first options before committing to a full bottle.',
        'Fast replacements if something feels off with your delivery.',
      ],
    },
    {
      title: 'Operations you can trust',
      copy: 'This site mirrors the tools we use every day to keep customers, products, and orders in sync.',
      points: [
        'Real-time inventory and transparent order summaries.',
        'Clear customer histories to support better recommendations.',
        'Shipping-ready details so your package moves without friction.',
      ],
    },
  ];

  const promises = [
    'Authentic bottles sourced directly or through vetted distributors.',
    'Eco-conscious packing with recyclable fillers.',
    'No animal testing on any fragrance we stock.',
  ];

  return (
    <div className="container">
      <div className="card about-card">
        <p className="pill">About Fragrance Shop</p>
        <div className="about-hero">
          <div>
            <h1>Crafted scents, curated with care</h1>
            <p className="about-lead">
              We started Fragrance Shop to make discovering niche scents feel welcoming, informed, and reliable.
              Our team blends thoughtful curation with an operations platform that keeps every bottle accounted for.
            </p>
            <p className="about-lead">
              Whether you are replenishing a signature scent or hunting for something bold and new, we handle the
              details—from storage and packing to proactive support—so you can focus on how it makes you feel.
            </p>
          </div>
          <div className="about-highlight">
            <h3>What guides us</h3>
            <ul className="about-list">
              <li>Story first: every fragrance comes with its maker&apos;s notes and origin.</li>
              <li>Freshness guaranteed: controlled storage, careful packing, quick dispatch.</li>
              <li>People over hype: honest recommendations that fit your style and routine.</li>
            </ul>
          </div>
        </div>

        <div className="about-grid">
          {pillars.map((pillar) => (
            <div className="about-panel" key={pillar.title}>
              <h3>{pillar.title}</h3>
              <p>{pillar.copy}</p>
              <ul className="about-list">
                {pillar.points.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="about-cta">
          <div>
            <h3>Our promise to you</h3>
            <p>
              A smooth experience from browse to unboxing: authenticated products, attentive support, and a team
              that treats your order like it is their own.
            </p>
            <div className="about-tags">
              {promises.map((promise) => (
                <span className="badge" key={promise}>{promise}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
