import {Injectable} from '@angular/core';

@Injectable({providedIn: 'root'})
export class Card5Service {
    getList(): Array<any> {
        return [
            {
                active: false,
                logo: 'assets/images/starbucks.png',
                title: 'Javascript Developer',
                intro: 'Full Time |Part Time',
                date: ' Today',
                city: 'Charleston',
                description: 'Must be a strong JavaScript developer with 3-5 years experience for UX/UI building a web interface that enables multi-cloud platform (website that allows gov clients to select cloud platform and sp...',
                money: '4000 - 5000 monthly'
            },
            {
                active: false,
                logo: 'assets/images/starbucks.png',
                title: 'Full stack Developer',
                intro: 'Full Time |Part Time',
                date: ' 6 days ago',
                city: 'Singapore',
                description: 'Are you looking for an opportunity at a growing company? Are you looking for a career that will challenge your technical skillset? If so then look no further! Currently we are looking to hire an ex...',
                money: '$70 - $90 / hour'
            },
            {
                active: false,
                logo: 'assets/images/starbucks.png',
                title: 'Senior JavaScript Engineer',
                intro: 'Full Time |Part Time',
                date: ' 12 days ago',
                city: 'Stamford',
                description: 'Robert Half Technology is looking for a Senior JavaScript Engineer for a 3 month contract-to-hire opportunity in Miami, FL with a leader in the software industry. The ideal candidate will bring to ...',
                money: '$95,000 - $105,000 / year'
            },
            {
                active: false,
                logo: 'assets/images/starbucks.png',
                title: 'Front End JavaScript Engineer',
                intro: 'Full Time |Part Time',
                date: ' 15 days ago',
                city: 'San Francisco',
                description: 'Jefferson Frank is the global leader for Amazon Web Services recruitment, advertising more AWS roles than any other agency. We deal with both AWS Partners &amp; End Users throughout North America. ...',
                money: '$90,000 - $110,000 / year'
            }
        ];
    }
}
