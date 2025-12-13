import { useState } from "react";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const mailtoLink = `mailto:prakashtimilsina76@gmail.com?subject=${encodeURIComponent(formData.subject)}&body=${encodeURIComponent(`Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`)}`;
    window.location.href = mailtoLink;
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const founders = [
    {
      name: "Hazekiller",
      role: "Contributor",
      email: "prakashtimilsina76@gmail.com",
      whatsapp: "+9779709315007",
      whatsappDisplay: "+977-9709315007",
      image: "https://nyxis.tech/prakash.png",
      bio: "Multi-stack developer,Ethical Hacker, Devops Engineer, passionate about creating accessible tools for Nepal"
    },
    {
      name: "Sunab Baskota",
      role: "Cotributor",
      email: "sunabbaskota@gmail.com",
      whatsapp: "+9779814945424",
      whatsappDisplay: "+977-9814945424",
      image: "https://nyxis.tech/sunab.jpg",
      bio: "Multi-Stack Developer,Devops Engineer focused on user experience and innovation"
    },
    {
      name: "Kshitiz Timilsina",
      role: "Contributor",
      email: "kshitiztimilsina122@gmail.com",
      whatsapp: "+97798125311181",
      whatsappDisplay: "+977-9825311181",
      image: "https://media-bom1-1.cdn.whatsapp.net/v/t61.24694-24/564783380_2182834882201137_7422737238540755927_n.jpg?ccb=11-4&oh=01_Q5Aa2wHaYj8HrbADulJW4yomTchGs3ksPtmeQuA-UmjfnxYARg&oe=68F87CF0&_nc_sid=5e03e0&_nc_cat=111",
      bio: "Junior-Backend Developer,AI/ML enthusiasts"
    },
     {
      name: "Suraj Khadka",
      role: "Contributor",
      email: "khadkasuraj98@gmail.com",
      whatsapp: "+977-980-0667230",
      whatsappDisplay: "+977-980-0667230",
      image: "https://media-bom1-1.cdn.whatsapp.net/v/t61.24694-24/491844147_1443868323309827_3695165604034065962_n.jpg?ccb=11-4&oh=01_Q5Aa2wG1jF01Y68h2hXCgzoZNSIFMI8lanqyQYI49PGE6Ri4nA&oe=68F87025&_nc_sid=5e03e0&_nc_cat=105",
      bio: "Backend Developer,I.O.T and Ethical Hacking Enthusiasts"
    },
     {
      name: "Jiwan Thakuri",
      role: "Contributor",
      email: "jiven446@gmail.com",
      whatsapp: "+977 986-2418705",
      whatsappDisplay: "+977 986-2418705",
      image: "https://media-bom1-1.cdn.whatsapp.net/v/t61.24694-24/404688829_3259868487642980_7554675173712728541_n.jpg?ccb=11-4&oh=01_Q5Aa2wF60VyrByoG9yS0zeTQ6W3Q8x3VpV2tDol76sV9R-tY6Q&oe=68F8EC3B&_nc_sid=5e03e0&_nc_cat=106",
      bio: "Frontend Developer, Sales & Marketing Associate"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-red-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-200">
      {/* Hero Section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <span className="inline-block bg-gradient-to-r from-blue-100 to-red-100 dark:from-blue-900 dark:to-red-900 text-blue-700 dark:text-blue-300 px-6 py-2 rounded-full text-sm font-semibold mb-6 border border-blue-200 dark:border-blue-800">
            🇳🇵 Get in Touch
          </span>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            Contact Us
          </h1>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
            Have questions, feedback, or want to contribute? We'd love to hear from you!
          </p>
        </div>
      </section>

      {/* Founders Section */}
      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 dark:text-white mb-4">
            Meet the Team
          </h2>
          <p className="text-center text-gray-600 dark:text-gray-400 mb-12 max-w-2xl mx-auto">
            Two passionate developers building HAMROpdf to serve Nepal and beyond
          </p>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {founders.map((founder, index) => (
              <div 
                key={index}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700 transition-all duration-300 hover:shadow-2xl transform hover:-translate-y-2"
              >
                {/* Profile Image */}
                <div className="relative h-64 bg-gradient-to-br from-blue-100 to-red-100 dark:from-blue-900 dark:to-red-900">
                  <img
                    src={founder.image}
                    alt={founder.name}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                </div>

                {/* Content */}
                <div className="p-8">
                  <div className="mb-4">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                      {founder.name}
                    </h3>
                    <p className="text-blue-600 dark:text-blue-400 font-semibold">
                      {founder.role}
                    </p>
                  </div>

                  <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                    {founder.bio}
                  </p>

                  {/* Contact Buttons */}
                  <div className="space-y-3">
                    {/* Email */}
                    <a
                      href={`mailto:${founder.email}`}
                      className="flex items-center gap-3 w-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-white px-4 py-3 rounded-lg transition-colors group"
                    >
                      <svg className="w-5 h-5 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                      </svg>
                      <span className="text-sm font-medium truncate">{founder.email}</span>
                    </a>

                    {/* WhatsApp */}
                    <a
                      href={`https://wa.me/${founder.whatsapp}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 w-full bg-green-500 hover:bg-green-600 text-white px-4 py-3 rounded-lg transition-colors group"
                    >
                      <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                      </svg>
                      <span className="text-sm font-semibold">{founder.whatsappDisplay}</span>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Join Us Section */}
      <section className="py-12 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="bg-gradient-to-br from-blue-600 to-red-600 dark:from-blue-700 dark:to-red-700 rounded-2xl p-8 md:p-12 text-center shadow-xl">
            <div className="text-5xl mb-4">🤝</div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Want to Contribute?
            </h2>
            <p className="text-lg text-blue-100 mb-6 max-w-2xl mx-auto leading-relaxed">
              We welcome developers, designers, and enthusiasts to join our mission. Whether you want to contribute code, suggest features, or collaborate on projects - we're excited to hear from you!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="mailto:prakashtimilsina76@gmail.com"
                className="inline-flex items-center justify-center bg-white hover:bg-gray-100 text-blue-700 font-bold px-8 py-3 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
                Email Us to Join
              </a>
              <a
                href="https://wa.me/9779709315007"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center bg-green-500 hover:bg-green-600 text-white font-bold px-8 py-3 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
                WhatsApp Us
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 md:p-12 border border-gray-100 dark:border-gray-700">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Send us a Message
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              Have feedback or suggestions? Fill out the form and we'll get back to you soon!
            </p>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                  Your Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
                  placeholder="Enter your name"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                  Your Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
                  placeholder="your.email@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
                  placeholder="What is this about?"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                  Message
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors resize-none"
                  placeholder="Tell us more..."
                />
              </div>

              <button
                onClick={handleSubmit}
                className="w-full bg-gradient-to-r from-blue-600 to-red-600 hover:from-blue-700 hover:to-red-700 text-white font-bold px-8 py-4 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                Send Message
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Note */}
      <section className="py-8 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-gray-600 dark:text-gray-400 mb-2">
            We typically respond within 24-48 hours
          </p>
          <p className="text-gray-900 dark:text-white font-medium">
            हाम्रो PDF - Built with ❤️ in Nepal 🇳🇵
          </p>
        </div>
      </section>
    </div>
  );
}