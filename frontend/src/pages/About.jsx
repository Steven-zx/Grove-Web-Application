// About Page
import React, { useState } from "react";
import InfoCard from "../components/shared/InfoCard";
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
} from "lucide-react";

export default function About() {
  const [expandedFAQ, setExpandedFAQ] = useState(null);
  const [activeRule, setActiveRule] = useState("Vehicle and Parking");

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
  <main className="bg-white min-h-screen max-w-screen-xl" style={{ marginLeft: "3rem" }}>
      {/* Header */}
      <div className="pt-1 pb-5">
        <div className="inline-flex items-center gap-2 text-sm text-[#1E1E1E] bg-white px-4 py-2 rounded-lg border border-[#D9D9D9]">
          <span>Augustine Grove Residential Village</span>
        </div>
      </div>

      {/* Hero */}
      <div className="flex justify-start">
        <div className="max-w-7xl w-full pt-1 pb-3 mb-1 min-h-[220px] md:min-h-[300px] lg:min-h-[450px]">
          <div className="grid grid-cols-1 lg:grid-cols-2 rounded-lg bg-[#E5EBE0] gap-8 items-center">
            <div className="p-6">
              <h1 className="text-4xl font-medium text-gray-900 mb-6">About us</h1>
              <p className="text-gray-600 text-lg leading-relaxed">
                Augustine Grove stands as a distinguished residential village in
                the heart of Iloilo City, Western Visayas, Philippines, renowned
                for its commitment to providing quality and peaceful residential
                experience designed for modern refinement, and convenience. The
                village offers residents an atmosphere of tranquility and
                exclusivity.
              </p>
            </div>

            <div className="flex justify-center">
              <img
                src={aboutHero}
                alt="Augustine Grove House"
                className="rounded-tr-lg rounded-br-lg w-full h-[450px] object-cover"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Features + What we offer */}
      <div className="flex justify-start">
        <div className="max-w-7xl w-full pt-1 pb-3 min-h-[220px] md:min-h-[300px] lg:min-h-[450px]">
          <div className="grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-x-5 items-start">
            {/* Features */}
            <div className="space-y-4">
              <div className="w-[100%] ml-auto">
                <div className="flex items-center gap-4 p-4 bg-white border border-[#D9D9D9] rounded-lg">
                  {/* Icon + Title */}
                  <div className="flex flex-col items-center justify-center">
                    <div className="w-20 h-14 flex items-center justify-center rounded-lg border border-[#D9D9D9] bg-white mb-2">
                      <Shield className="w-6 h-6 text-[#1E1E1E]" />
                    </div>
                    <span className="text-lg font-medium text-gray-900">SECURE</span>
                  </div>
                  {/* Description */}
                  <p className="text-gray-700 leading-relaxed">
                    We keep our community safe with a welcoming gated entrance,
                    friendly 24/7 guards, and round-the-clock CCTV protection.
                  </p>
                </div>
              </div>
              <div className="w-[90%] ml-auto">
                <div className="flex items-center gap-4 p-4 bg-white border border-[#D9D9D9] rounded-lg">
                  <div className="flex flex-col items-center justify-center">
                    <div className="w-20 h-14 flex items-center justify-center rounded-lg border border-[#D9D9D9] bg-white mb-2">
                      <Bird className="w-6 h-6 text-[#1E1E1E]" />
                    </div>
                    <span className="text-lg font-medium text-gray-900">PEACEFUL</span>
                  </div>
                  <p className="text-gray-700 leading-relaxed">
                    We offer a tranquil escape from city life, creating a serene
                    atmosphere that nurtures privacy and peaceful moments for our
                    residents.
                  </p>
                </div>
              </div>
              <div className="w-[80%] ml-auto">
                <div className="flex items-center gap-4 p-4 bg-white border border-[#D9D9D9] rounded-lg">
                  <div className="flex flex-col items-center justify-center">
                    <div className="w-20 h-14 flex items-center justify-center rounded-lg border border-[#D9D9D9] bg-white mb-2">
                      <CheckCircle className="w-6 h-6 text-[#1E1E1E]" />
                    </div>
                    <span className="text-lg font-medium text-gray-900">CONVENIENT</span>
                  </div>
                  <p className="text-gray-700 leading-relaxed">
                    We keep you close to life’s essentials, with shopping centers,
                    supermarkets, and local markets just minutes away for effortless
                    errands.
                  </p>
                </div>
              </div>
            </div>
            {/* What we offer */}
            <div className="rounded-lg p-10 bg-[#E5EBE0] h-full">
              <div>
                <h2 className="text-2xl font-medium text-gray-900 mb-4">
                  What we offer
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  It is a thoughtfully designed community that blends modern
                  amenities—like a multi-purpose hall, basketball court, and
                  swimming pool—with the natural beauty of its surroundings.
                </p>
                <br />
                <p className="text-gray-700 leading-relaxed">
                  Its ideal location allows residents to enjoy the tranquility
                  of village life while staying connected to the vibrant
                  offerings of Iloilo City, making it a lifestyle choice that
                  values elegance, quality, and community.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* House Rules */}
      <div className="flex justify-start">
        <div className="bg-white rounded-lg mb-1 max-w-7xl w-full pb-3 min-h-[220px] md:min-h-[300px] lg:min-h-[450px]">
          <div className="grid grid-cols-1 lg:grid-cols-2 items-stretch rounded-lg border border-[#D9D9D9]">
            <div className="bg-[#E5EBE0] rounded-tl-lg rounded-bl-lg p-10 flex flex-col h-full">
              {rules[activeRule]}
            </div>
            <div className="flex flex-col gap-6 h-full">
              <img
                src={aboutSecurity}
                alt="Augustine Grove Security"
                className="rounded-tr-lg w-full h-[220px] object-cover"
              />
              <div className="pt-4 pb-10 px-10">
                <h2 className="text-2xl font-medium text-gray-900 mb-4">
                  House Rules and Security Regulations
                </h2>
                <div className="grid grid-cols-2 gap-3">
                  {Object.keys(rules).map((rule) => (
                    <button
                      key={rule}
                      onClick={() => setActiveRule(rule)}
                      className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
                        activeRule === rule
                          ? "bg-[#EFEFEF] text-gray-900 border-[#EFEFEF]"
                          : "bg-gray-50 text-gray-800 border-gray-200 hover:bg-gray-100"
                      }`}
                    >
                      {rule}
                    </button>
                  ))}
                  <a
                    href="/AGRVHOAI_House_Rules_and_Security_Regulations.pdf"
                    download
                    className="flex items-center justify-center gap-2 bg-[#40863A] text-white px-4 py-2 rounded-lg hover:bg-[#35702c] transition-colors w-full"
                  >
                    <Download size={16} />
                    <span className="text-center">Download a copy</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Get in touch + Services */}
    <div className="flex justify-start">
      <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1.2fr_0.6fr] gap-5 mb-2 max-w-7xl w-full pt-1 pb-3 min-h-[220px] md:min-h-[300px] lg:min-h-[450px]">
          {/* Get in touch */}
          <div className="h-full flex flex-col justify-between gap-4">
            <div className="bg-white rounded-lg border border-[#D9D9D9] p-10">
              <h2 className="text-2xl font-semi text-gray-900 mb-2">Get in touch</h2>
              <p className="text-gray-600 mb-4">Let us know how we can help.</p>
            </div>
            <div className="bg-white rounded-lg border border-[#D9D9D9] p-10">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                AGVR Homeowner's Association
              </h3>
              <div className="space-y-4">
                {[
                  { name: "Emelda Limbang", role: "President", phone: "0910 515 8805" },
                  { name: "Stephen Alayon", role: "Assistant Secretary", phone: "0919 450 6688" },
                  { name: "Ailyn Acopio", role: "Treasurer", phone: "0919 450 6688" },
                ].map((person, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <User
                      strokeWidth={1}
                      className="w-15 h-13 text-gray-500 rounded-lg border border-[#D9D9D9] p-1 bg-white"
                    />
                    <div>
                      <p className="font-medium text-gray-900">{person.name}</p>
                      <p className="text-sm text-gray-600">{person.role}</p>
                      <p className="text-sm text-gray-600">{person.phone}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Services */}
          <div className="bg-[#E5EBE0] rounded-lg p-10 flex flex-col justify-between">
            <div>
              <h2 className="text-2xl font-medium text-gray-900 mb-4">Services</h2>
              <div className="space-y-5">
                <div className="flex items-center gap-3">
                  <Building
                    strokeWidth={1}
                    className="w-15 h-13 text-gray-500 rounded-lg border border-[#D9D9D9] p-1 bg-white"
                  />
                  <div>
                    <p className="font-medium text-gray-900">Admin Office</p>
                    <p className="text-sm text-gray-600">augustinegrovehoa@gmail.com</p>
                    <p className="text-sm text-gray-600">Mon-Fri from 9 AM to 5 PM</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Shield
                    strokeWidth={1}
                    className="w-15 h-13 text-gray-500 rounded-lg border border-[#D9D9D9] p-1 bg-white"
                  />
                  <div>
                    <p className="font-medium text-gray-900">Security Guardhouse</p>
                    <p className="text-sm text-gray-600">24/7 Service</p>
                    <p className="text-sm text-gray-600">Located at the entrance</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Wrench
                    strokeWidth={1}
                    className="w-15 h-13 text-gray-500 rounded-lg border border-[#D9D9D9] p-1 bg-white"
                  />
                  <div>
                    <p className="font-medium text-gray-900">Maintenance</p>
                    <p className="text-sm text-gray-600">augustinegrovehoa@gmail.com</p>
                    <p className="text-sm text-gray-600">Mon-Fri from 9 AM to 5 PM</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Mail
                    strokeWidth={1}
                    className="w-15 h-13 text-gray-500 rounded-lg border border-[#D9D9D9] p-1 bg-white"
                  />
                  <div>
                    <p className="font-medium text-gray-900">Augustine Grove Residential Village</p>
                    <p className="text-sm text-gray-600">Got questions? Chat with us here!</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin
                    strokeWidth={1}
                    className="w-15 h-13 text-gray-500 rounded-lg border border-[#D9D9D9] p-1 bg-white"
                  />
                  <div>
                    <p className="font-medium text-gray-900">Sambag, Jaro, Iloilo City</p>
                    <p className="text-sm text-gray-600">View on Google Maps</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Grove Life */}
          <div className="flex flex-col gap-4 items-center">
            <div className="bg-white rounded-lg border border-[#D9D9D9] p-4 flex flex-col justify-center h-full w-full flex-grow">
            <div className="self-center">
              <p className="text-xl text-[#1E1E1E]">Choose the</p>
              <p className="text-3xl italic text-[#1E1E1E]">Grove Life</p>
            </div>
          </div>
            <div className="bg-white rounded-lg border border-[#D9D9D9] p-4 flex flex-col justify-center items-center w-full flex-shrink">
              <img src={agRealLogo} alt="Augustine Grove Logo" className="w-42 h-42" />
            </div>
          </div>
        </div>
      </div>

      {/* FAQ */}
    <div className="flex justify-start">
      <div className="bg-white rounded-lg p-2 mb-1 max-w-7xl w-full pb-3 min-h-[220px] md:min-h-[300px] lg:min-h-[450px]">
          <div className="inline-flex items-center gap-2 text-sm font-normal text-[#1E1E1E] bg-white px-4 py-2 rounded-lg border border-[#D9D9D9] mb-4">
            <span>Frequently Asked Questions</span>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="border border-gray-200 rounded-lg">
                <button
                  className="w-full text-left p-4 flex justify-between items-center hover:bg-gray-50 transition-colors"
                  onClick={() => toggleFAQ(index)}
                >
                  <span className="font-medium text-gray-900">{faq.question}</span>
                  <span className="text-gray-400">
                    {expandedFAQ === index ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </span>
                </button>
                {expandedFAQ === index && (
                  <div className="px-4 pb-4">
                    <p className="text-gray-600">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
