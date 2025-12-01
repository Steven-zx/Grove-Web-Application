
import React, { useState } from "react";
import MobileNavbar from "../components/layout/MobileNavbar";
import MobileSidebar from "../components/layout/MobileSidebar";
import aboutHero from "../assets/about-hero.webp";
import aboutSecurity from "../assets/about-security.webp";
import agRealLogo from "../assets/ag_real_logo.png";
import {
  Shield,
  Bird,
  CheckCircle,
  Building,
  Wrench,
  Mail,
  MapPin,
  User,
  Download,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
} from "lucide-react";

export default function AboutMobile() {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const [expandedFAQ, setExpandedFAQ] = useState(null);

  const toggleFAQ = (index) => {
    setExpandedFAQ(expandedFAQ === index ? null : index);
  };

  const faqs = [
    {
      question: "How do I pay my monthly HOA fees?",
      answer:
        "You can pay your monthly HOA fees via bank transfer to our official account, or drop off a check at the Admin Office.",
    },
    {
      question:
        "What are the requirements to purchase a property in Augustine Grove?",
      answer:
        "Prospective buyers need a valid ID, proof of income, and must complete our HOA application form, available at the Admin Office.",
    },
    {
      question: "How can I register my visitors for entry?",
      answer:
        "Use the “Generate QR” feature on the Home Page: fill in visitor details and print or save the QR code for gate entry.",
    },
    {
      question: "What are the construction guidelines for new homes?",
      answer:
        "All new constructions must adhere to the HOA’s architectural guidelines—see the full PDF on the “About” page or contact the Admin Office.",
    },
    {
      question: "How can I report maintenance issues in common areas?",
      answer:
        "Navigate to the “Concerns” page, fill out the form with details and images, and submit. The maintenance team will be notified immediately.",
    },
  ];

  const [activeRule, setActiveRule] = useState(null);

  // House Rules content
  const rules = {
    Registration: (
      <div>
        <h2 className="text-2xl font-medium text-gray-900 mb-4">Registration</h2>
        <ul className="list-decimal list-inside space-y-2 text-gray-700">
          <li>
            Homeowners and long-term lessees are required to register their
            household members and vehicles on our online database.
          </li>
          <li>Tenants are to be registered in the security logbook.</li>
        </ul>
      </div>
    ),
    "Vehicle and Parking": (
      <div>
        <h2 className="text-2xl font-medium text-gray-900 mb-4">
          Vehicle and Parking
        </h2>
        <ul className="list-decimal list-inside space-y-2 text-gray-700">
          <li>Homeowner’s vehicles have to be parked properly, in the garage.</li>
          <li>
            Vehicles in driveways must not obstruct sidewalks or extend beyond
            driveways.
          </li>
          <li>No double parking at all times.</li>
          <li>
            Street parking is allowed only in front of one’s property, without
            protruding to neighbors.
          </li>
          <li>No parking across another property.</li>
          <li>
            Commercial vehicles may only park for up to 5 hours unless
            rendering service.
          </li>
          <li>Delivery riders and vendors must surrender a valid ID.</li>
          <li>
            No parking from the gate to the entrance except for stickered
            vehicles.
          </li>
          <li>Designated parking/no-parking zones will be marked.</li>
        </ul>
      </div>
    ),
    "Entry of Vehicles": (
      <div>
        <h2 className="text-2xl font-medium text-gray-900 mb-4">
          Entry of Vehicles
        </h2>
        <ul className="list-decimal list-inside space-y-2 text-gray-700">
          <li>Only one side of the gate will be open, except in emergencies.</li>
          <li>Incoming vehicles will be prioritized.</li>
          <li>Drivers must observe a 20 kph speed limit.</li>
          <li>At night, drivers must switch on the passenger’s light.</li>
          <li>Only vehicles with valid stickers may enter.</li>
          <li>No ID, No Entry for vehicles without stickers.</li>
          <li>Visitors’ vehicles require inspection and valid ID.</li>
        </ul>
      </div>
    ),
    "Entry of Persons": (
      <div>
        <h2 className="text-2xl font-medium text-gray-900 mb-4">
          Entry of Persons
        </h2>
        <ul className="list-decimal list-inside space-y-2 text-gray-700">
          <li>Visitors should be registered in advance by homeowners.</li>
          <li>
            Laborers and salesmen must be pre-registered by homeowners before
            entry.
          </li>
          <li>
            If no advice was given, the guard will contact the homeowner for
            clearance.
          </li>
          <li>Scrappers are not allowed inside.</li>
        </ul>
      </div>
    ),
    Pets: (
      <div>
        <h2 className="text-2xl font-medium text-gray-900 mb-4">Pets</h2>
        <ul className="list-decimal list-inside space-y-2 text-gray-700">
          <li>Pets must remain inside the owner’s property.</li>
          <li>Pets must be on a leash when outside.</li>
          <li>Owners must clean up after pets.</li>
          <li>Pet odors must be managed responsibly.</li>
        </ul>
      </div>
    ),
    Waste: (
      <div>
        <h2 className="text-2xl font-medium text-gray-900 mb-4">Waste</h2>
        <ul className="list-decimal list-inside space-y-2 text-gray-700">
          <li>
            Dumping of grease, chemicals, or hazardous waste into drains is
            strictly prohibited.
          </li>
        </ul>
      </div>
    ),
    "Noise and Party": (
      <div>
        <h2 className="text-2xl font-medium text-gray-900 mb-4">
          Noise and Party
        </h2>
        <ul className="list-decimal list-inside space-y-2 text-gray-700">
          <li>Homeowners must minimize noise during parties.</li>
          <li>No loud noise between 10 PM and 5 AM.</li>
        </ul>
      </div>
    ),
  };

  return (
    <div className="flex flex-col bg-white min-h-screen">
      <MobileNavbar onMenuClick={() => setSidebarOpen(true)} />
      <MobileSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="flex-1 px-4 sm:px-3 md:px-2 pt-34 pb-8 space-y-6 sm:space-y-5 md:space-y-4">
        {/* Header */}
        <div className="pt-1 pb-1">
          <div className="inline-flex items-center text-sm text-[#1E1E1E] bg-white px-4 py-2 rounded-lg border border-[#D9D9D9]">
            <span>Augustine Grove Residential Village</span>
          </div>
        </div>

        {/* About Us */}
        <div className="bg-[#E5EBE0] rounded-lg overflow-hidden min-h-[400px] sm:min-h-[350px] md:min-h-[300px]">
          <div className="p-6 sm:p-4 md:p-3 h-1/2 flex flex-col justify-center">
            <h1 className="text-3xl sm:text-2xl md:text-xl font-medium text-gray-900 mb-4 sm:mb-3 md:mb-2">About us</h1>
            <p className="text-gray-600 text-lg sm:text-base md:text-sm leading-relaxed">
              Augustine Grove stands as a distinguished residential village in
              the heart of Iloilo City, Western Visayas, Philippines, renowned
              for its commitment to providing quality and peaceful residential
              experience designed for modern refinement, and convenience. The
              village offers residents an atmosphere of tranquility and
              exclusivity.
            </p>
          </div>
          <img
            src={aboutHero}
            alt="Augustine Grove House"
            className="w-full h-1/2 object-cover"
          />
        </div>

        {/* Features */}
        <div className="space-y-4 sm:space-y-3 md:space-y-2">
          <div className="flex items-center gap-4 sm:gap-3 md:gap-2 p-4 sm:p-3 md:p-2 bg-white border border-[#D9D9D9] rounded-lg">
            <div className="flex flex-col items-center justify-center">
              <div className="w-16 sm:w-14 md:w-12 h-12 sm:h-10 md:h-8 flex items-center justify-center rounded-lg border border-[#D9D9D9] bg-white mb-2">
                <Shield className="w-5 sm:w-4 md:w-3 h-5 sm:h-4 md:h-3 text-[#1E1E1E]" />
              </div>
              <span className="text-base sm:text-sm md:text-xs font-medium text-gray-900">SECURE</span>
            </div>
            <p className="text-gray-700 leading-relaxed flex-1 text-base sm:text-sm md:text-xs">
              We keep our community safe with a welcoming gated entrance,
              friendly 24/7 guards, and round-the-clock CCTV protection.
            </p>
          </div>
          <div className="flex items-center gap-4 sm:gap-3 md:gap-2 p-4 sm:p-3 md:p-2 bg-white border border-[#D9D9D9] rounded-lg">
            <div className="flex flex-col items-center justify-center">
              <div className="w-16 sm:w-14 md:w-12 h-12 sm:h-10 md:h-8 flex items-center justify-center rounded-lg border border-[#D9D9D9] bg-white mb-2">
                <Bird className="w-5 sm:w-4 md:w-3 h-5 sm:h-4 md:h-3 text-[#1E1E1E]" />
              </div>
              <span className="text-base sm:text-sm md:text-xs font-medium text-gray-900">PEACEFUL</span>
            </div>
            <p className="text-gray-700 leading-relaxed flex-1 text-base sm:text-sm md:text-xs">
              We offer a tranquil escape from city life, creating a serene
              atmosphere that nurtures privacy and peaceful moments for our
              residents.
            </p>
          </div>
          <div className="flex items-center gap-4 sm:gap-3 md:gap-2 p-4 sm:p-3 md:p-2 bg-white border border-[#D9D9D9] rounded-lg">
            <div className="flex flex-col items-center justify-center">
              <div className="w-16 sm:w-14 md:w-12 h-12 sm:h-10 md:h-8 flex items-center justify-center rounded-lg border border-[#D9D9D9] bg-white mb-2">
                <CheckCircle className="w-5 sm:w-4 md:w-3 h-5 sm:h-4 md:h-3 text-[#1E1E1E]" />
              </div>
              <span className="text-base sm:text-sm md:text-xs font-medium text-gray-900">CONVENIENT</span>
            </div>
            <p className="text-gray-700 leading-relaxed flex-1 text-base sm:text-sm md:text-xs">
              We keep you close to life’s essentials, with shopping centers,
              supermarkets, and local markets just minutes away for effortless
              errands.
            </p>
          </div>
        </div>

        {/* What we offer */}
        <div className="bg-[#E5EBE0] rounded-lg p-6 sm:p-4 md:p-3">
          <h2 className="text-2xl sm:text-xl md:text-lg font-medium text-gray-900 mb-4 sm:mb-3 md:mb-2">
            What we offer
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4 sm:mb-3 md:mb-2 text-base sm:text-sm md:text-xs">
            It is a thoughtfully designed community that blends modern
            amenities—like a multi-purpose hall, basketball court, and
            swimming pool—with the natural beauty of its surroundings.
          </p>
          <p className="text-gray-700 leading-relaxed text-base sm:text-sm md:text-xs">
            Its ideal location allows residents to enjoy the tranquility
            of village life while staying connected to the vibrant
            offerings of Iloilo City, making it a lifestyle choice that
            values elegance, quality, and community.
          </p>
        </div>

        {/* House Rules and Security Regulations */}
        {activeRule ? (
          <div className="bg-white rounded-lg border border-[#D9D9D9] p-6 sm:p-4 md:p-3">
            <button
              onClick={() => setActiveRule(null)}
              className="flex items-center gap-2 mb-4 sm:mb-3 md:mb-2 text-gray-600 hover:text-gray-900"
            >
              <ChevronLeft size={20} />
              <span className="text-base sm:text-sm md:text-xs">Back</span>
            </button>
            <div className="bg-[#E5EBE0] rounded-lg p-6 sm:p-4 md:p-3 h-[492px] sm:h-[450px] md:h-[400px] overflow-y-auto">
              {rules[activeRule]}
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg border border-[#D9D9D9] p-6 sm:p-4 md:p-3">
            <img
              src={aboutSecurity}
              alt="Augustine Grove Security"
              className="w-full h-48 sm:h-40 md:h-32 object-cover rounded-lg mb-4 sm:mb-3 md:mb-2"
            />
            <h2 className="text-2xl sm:text-xl md:text-lg font-medium text-gray-900 mb-4 sm:mb-3 md:mb-2">
              House Rules and Security Regulations
            </h2>
            <div className="grid grid-cols-2 gap-3 sm:gap-2 md:gap-1 mb-4 sm:mb-3 md:mb-2">
              {Object.keys(rules).map((rule) => (
                <button
                  key={rule}
                  onClick={() => setActiveRule(rule)}
                  className="px-3 sm:px-2 md:px-1 py-2 sm:py-1 md:py-1 rounded-lg border text-sm sm:text-xs md:text-xs font-medium bg-gray-50 text-gray-800 border-gray-200 hover:bg-gray-100"
                >
                  {rule}
                </button>
              ))}
            </div>
            <a
              href="/AGRVHOAI_House_Rules_and_Security_Regulations.pdf"
              download
              className="flex items-center justify-center gap-2 bg-[#40863A] text-white px-4 sm:px-3 md:px-2 py-2 sm:py-1 md:py-1 rounded-lg hover:bg-[#35702c] transition-colors w-full text-base sm:text-sm md:text-xs"
            >
              <Download size={16} />
              <span>Download a copy</span>
            </a>
          </div>
        )}

        {/* Get in touch */}
        <div className="bg-white rounded-lg border border-[#D9D9D9] p-6 sm:p-4 md:p-3">
          <h2 className="text-2xl sm:text-xl md:text-lg font-medium text-gray-900 mb-2 sm:mb-1 md:mb-1">Get in touch</h2>
          <p className="text-gray-600 text-base sm:text-sm md:text-xs">Let us know how we can help.</p>
        </div>

        {/* AGVR Homeowner's Association */}
        <div className="bg-white rounded-lg border border-[#D9D9D9] p-6 sm:p-4 md:p-3">
          <h3 className="text-lg sm:text-base md:text-sm font-medium text-gray-900 mb-4 sm:mb-3 md:mb-2">
            AGVR Homeowner's Association
          </h3>
          <div className="space-y-4 sm:space-y-3 md:space-y-2">
            {[
              { name: "Emelda Limbang", role: "President", phone: "0910 515 8805" },
              { name: "Stephen Alayon", role: "Assistant Secretary", phone: "0919 450 6688" },
              { name: "Ailyn Acopio", role: "Treasurer", phone: "0919 450 6688" },
            ].map((person, i) => (
              <div key={i} className="flex items-center gap-3 sm:gap-2 md:gap-1">
                <User
                  strokeWidth={1}
                  className="w-12 sm:w-10 md:w-8 h-10 sm:h-8 md:h-6 text-gray-500 rounded-lg border border-[#D9D9D9] p-1 bg-white"
                />
                <div>
                  <p className="font-medium text-gray-900 text-base sm:text-sm md:text-xs">{person.name}</p>
                  <p className="text-sm sm:text-xs md:text-xs text-gray-600">{person.role}</p>
                  <p className="text-sm sm:text-xs md:text-xs text-gray-600">{person.phone}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Services */}
        <div className="bg-[#E5EBE0] rounded-lg p-6 sm:p-4 md:p-3">
          <h2 className="text-2xl sm:text-xl md:text-lg font-medium text-gray-900 mb-4 sm:mb-3 md:mb-2">Services</h2>
          <div className="space-y-5 sm:space-y-4 md:space-y-3">
            <div className="flex items-center gap-3 sm:gap-2 md:gap-1">
              <Building
                strokeWidth={1}
                className="w-12 sm:w-10 md:w-8 h-10 sm:h-8 md:h-6 text-gray-500 rounded-lg border border-[#D9D9D9] p-1 bg-white"
              />
              <div>
                <p className="font-medium text-gray-900 text-base sm:text-sm md:text-xs">Admin Office</p>
                <p className="text-sm sm:text-xs md:text-xs text-gray-600">augustinegrovehoa@gmail.com</p>
                <p className="text-sm sm:text-xs md:text-xs text-gray-600">Mon-Fri from 9 AM to 5 PM</p>
              </div>
            </div>
            <div className="flex items-center gap-3 sm:gap-2 md:gap-1">
              <Shield
                strokeWidth={1}
                className="w-12 sm:w-10 md:w-8 h-10 sm:h-8 md:h-6 text-gray-500 rounded-lg border border-[#D9D9D9] p-1 bg-white"
              />
              <div>
                <p className="font-medium text-gray-900 text-base sm:text-sm md:text-xs">Security Guardhouse</p>
                <p className="text-sm sm:text-xs md:text-xs text-gray-600">24/7 Service</p>
                <p className="text-sm sm:text-xs md:text-xs text-gray-600">Located at the entrance</p>
              </div>
            </div>
            <div className="flex items-center gap-3 sm:gap-2 md:gap-1">
              <Wrench
                strokeWidth={1}
                className="w-12 sm:w-10 md:w-8 h-10 sm:h-8 md:h-6 text-gray-500 rounded-lg border border-[#D9D9D9] p-1 bg-white"
              />
              <div>
                <p className="font-medium text-gray-900 text-base sm:text-sm md:text-xs">Maintenance</p>
                <p className="text-sm sm:text-xs md:text-xs text-gray-600">augustinegrovehoa@gmail.com</p>
                <p className="text-sm sm:text-xs md:text-xs text-gray-600">Mon-Fri from 9 AM to 5 PM</p>
              </div>
            </div>
            <div className="flex items-center gap-3 sm:gap-2 md:gap-1">
              <Mail
                strokeWidth={1}
                className="w-12 sm:w-10 md:w-8 h-10 sm:h-8 md:h-6 text-gray-500 rounded-lg border border-[#D9D9D9] p-1 bg-white"
              />
              <div>
                <p className="font-medium text-gray-900 text-base sm:text-sm md:text-xs">Augustine Grove Residential Village</p>
                <p className="text-sm sm:text-xs md:text-xs text-gray-600">Got questions? Chat with us here!</p>
              </div>
            </div>
            <div className="flex items-center gap-3 sm:gap-2 md:gap-1">
              <MapPin
                strokeWidth={1}
                className="w-12 sm:w-10 md:w-8 h-10 sm:h-8 md:h-6 text-gray-500 rounded-lg border border-[#D9D9D9] p-1 bg-white"
              />
              <div>
                <p className="font-medium text-gray-900 text-base sm:text-sm md:text-xs">Sambag, Jaro, Iloilo City</p>
                <p className="text-sm sm:text-xs md:text-xs text-gray-600">View on Google Maps</p>
              </div>
            </div>
          </div>
        </div>

        {/* Choose the Grove Life and Logo */}
        <div className="flex gap-4 sm:gap-3 md:gap-2">
          <div className="bg-white rounded-lg border border-[#D9D9D9] p-4 sm:p-3 md:p-2 flex flex-col justify-center flex-1">
            <div className="text-center">
              <p className="text-lg sm:text-base md:text-sm text-[#1E1E1E]">Choose the</p>
              <p className="text-2xl sm:text-xl md:text-lg italic text-[#1E1E1E]">Grove Life</p>
            </div>
          </div>
          <div className="bg-white rounded-lg border border-[#D9D9D9] p-4 sm:p-3 md:p-2 flex flex-col justify-center items-center flex-1">
            <img src={agRealLogo} alt="Augustine Grove Logo" className="w-20 sm:w-16 md:w-12 h-20 sm:h-16 md:h-12" />
          </div>
        </div>

        {/* FAQ */}
        <div className="bg-white rounded-lg p-4 sm:p-3 md:p-2">
          <div className="inline-flex items-center gap-2 text-sm sm:text-xs md:text-xs font-normal text-[#1E1E1E] bg-white px-4 sm:px-3 md:px-2 py-2 rounded-lg border border-[#D9D9D9] mb-4 sm:mb-3 md:mb-2">
            <span>Frequently Asked Questions</span>
          </div>
          <div className="space-y-4 sm:space-y-3 md:space-y-2">
            {faqs.map((faq, index) => (
              <div key={index} className="border border-gray-200 rounded-lg">
                <button
                  className="w-full text-left p-4 sm:p-3 md:p-2 flex justify-between items-center hover:bg-gray-50 transition-colors"
                  onClick={() => toggleFAQ(index)}
                >
                  <span className="font-medium text-gray-900 text-base sm:text-sm md:text-xs">{faq.question}</span>
                  <span className="text-gray-400">
                    {expandedFAQ === index ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </span>
                </button>
                {expandedFAQ === index && (
                  <div className="px-4 sm:px-3 md:px-2 pb-4 sm:pb-3 md:pb-2">
                    <p className="text-gray-600 text-base sm:text-sm md:text-xs">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
