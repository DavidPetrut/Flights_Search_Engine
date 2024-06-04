import { Component } from '@angular/core';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.css']
})
export class FaqComponent {

  faqs = [
    {
      question: 'What is your refund policy for canceled flights?',
      answer: 'Our refund policy allows passengers to receive a full refund for flights canceled within 24 hours of booking. For cancellations made later, a fee may apply depending on the fare type purchased.',
      isOpen: false
    },
    {
      question: 'How can I find the best prices for flights?',
      answer: 'To find the best prices, we recommend booking in advance and being flexible with your travel dates. Check our website regularly for special deals and promotions.',
      isOpen: false
    },
    {
      question: 'When should I arrive at the airport before my flight?',
      answer: 'For domestic flights, please arrive at least 2 hours before departure. For international flights, we recommend arriving 3 hours in advance to allow time for check-in, security, and boarding.',
      isOpen: false
    },
    {
      question: 'Can I change or cancel my trip after booking?',
      answer: 'Yes, changes and cancellations are possible. Fees and conditions may vary depending on the fare type. Please review our change and cancellation policy for details.',
      isOpen: false
    },
    {
      question: 'What documentation do I need for air travel?',
      answer: 'You\'ll need a valid passport for international travel and may also require a visa depending on your destination. For domestic flights, a government-issued photo ID is required.',
      isOpen: false
    },
    {
      question: 'How do I update passenger details after booking?',
      answer: 'Passenger details can be updated through our customer service portal or by contacting our support team directly. Fees for changes may apply.',
      isOpen: false
    },
    {
      question: 'Where can I find billing information for my flight?',
      answer: 'Billing information is available in your booking confirmation email and can also be accessed via our customer service portal.',
      isOpen: false
    },
    {
      question: 'What is your policy on additional services like extra baggage and seat selection?',
      answer: 'Extra services including additional baggage and seat selection are available for a fee. Prices and policies are detailed on our website.',
      isOpen: false
    },
    {
      question: 'Do you offer discounts for students or senior citizens?',
      answer: 'Yes, we offer discounts for students and senior citizens. Please provide valid identification to qualify for these special rates.',
      isOpen: false
    },
    {
      question: 'How can I request special assistance for passengers with disabilities?',
      answer: 'Special assistance for passengers with disabilities can be requested at the time of booking or by contacting our customer service team.',
      isOpen: false
    },
    {
      question: 'Are pets allowed on flights?',
      answer: 'Pets are allowed on certain flights, subject to specific conditions and fees. Please check our pet policy or contact customer service for more information.',
      isOpen: false
    },
    {
      question: 'What are the baggage allowances for my flight?',
      answer: 'Baggage allowances vary by airline, destination, and ticket class. Typically, economy fares include one carry-on and one checked bag. Please verify the specific allowances on your booking confirmation.',
      isOpen: false
    },
    {
      question: 'How do I check in for my flight?',
      answer: 'Online check-in is available 24 hours before departure through our website or mobile app. Airport check-in counters open 3 hours before scheduled flights.',
      isOpen: false
    },
    {
      question: 'Can I select my seat when booking a flight?',
      answer: 'Yes, you can select your seat during the booking process for most flights. Some airlines may charge an additional fee for seat selection.',
      isOpen: false
    },
    {
      question: 'What should I do if my flight is delayed or cancelled?',
      answer: 'In case of delays or cancellations, we will notify you via email or SMS. You can rebook or request a refund through our customer service portal.',
      isOpen: false
    },
    {
      question: 'Is there a loyalty program for frequent flyers?',
      answer: 'Yes, we offer a loyalty program that rewards frequent flyers with points that can be redeemed for flights, upgrades, and other services.',
      isOpen: false
    },
    {
      question: 'What are the requirements for traveling with an infant?',
      answer: 'Infants under two years do not require their own seat but must travel with an adult. Please inform us at booking if you\'re traveling with an infant.',
      isOpen: false
    },
    {
      question: 'How can I make a group booking?',
      answer: 'For group bookings, please contact our group travel department directly through our website or customer service line.',
      isOpen: false
    },
    {
      question: 'What happens if I miss my flight?',
      answer: 'If you miss your flight, your ticket may no longer be valid. Depending on the fare conditions, you may be able to rebook for a fee.',
      isOpen: false
    },
    {
      question: 'Are meals included in my flight ticket?',
      answer: 'Meals are included on most long-haul flights. For short-haul flights, meals may be purchased onboard. Please check your flight details for specific information.',
      isOpen: false
    },
    {
      question: 'How do I use a promo code when booking a flight?',
      answer: 'You can enter your promo code at checkout. The discount will be applied to the final price before payment.',
      isOpen: false
    },
    {
      question: 'What types of payment do you accept?',
      answer: 'We accept all major credit cards, debit cards, and PayPal for flight bookings.',
      isOpen: false
    },
    {
      question: 'Can I travel if my passport is expiring soon?',
      answer: 'Many countries require your passport to be valid for at least six months beyond your date of travel. Check the passport requirements for your destination before booking.',
      isOpen: false
    },
    {
      question: 'How do I add travel insurance to my booking?',
      answer: 'You can add travel insurance during the booking process or through our customer service portal before your flight.',
      isOpen: false
    },
    {
      question: 'What is the policy for traveling with electronic devices?',
      answer: 'Electronic devices such as laptops and tablets may be carried on board but must be turned off or set to airplane mode during the flight.',
      isOpen: false
    },
    {
      question: 'Can I request a special meal for my flight?',
      answer: 'Special meals for dietary or religious reasons can be requested through our customer service portal or directly with the airline after booking.',
      isOpen: false
    },
    {
      question: 'What are the rules for carry-on luggage?',
      answer: 'Carry-on luggage must fit under the seat or in the overhead bin. Size and weight limits vary by airline and can be found on your booking confirmation.',
      isOpen: false
    },
    {
      question: 'How do I find out if there are any travel advisories for my destination?',
      answer: 'We recommend checking the official website of the destinations embassy or consulate for any travel advisories before booking.',
      isOpen: false
    },
    {
      question: 'What should I do if I have a connecting flight?',
      answer: 'For connecting flights, ensure you have enough time between flights to go through security and reach your next gate. We suggest at least a 2-hour layover for domestic flights and 3 hours for international connections.',
      isOpen: false
    },
    {
      question: 'Is Wi-Fi available on flights?',
      answer: 'Wi-Fi is available on select flights and airlines, often for an additional fee. Please check Wi-Fi availability and pricing for your flight in our booking platform.',
      isOpen: false
    }
];


  toggleFaq(index: number): void {
    this.faqs[index].isOpen = !this.faqs[index].isOpen;
  }
}
