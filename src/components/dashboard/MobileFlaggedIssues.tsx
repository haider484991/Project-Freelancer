import Image from 'next/image'

const flaggedIssues = [
  {
    name: 'Hilton Santana',
    image: '/images/clients/hilton.jpg',
    issue: 'Missed last check-in',
    color: '#D40101'
  },
  {
    name: 'Hilton Santana',
    image: '/images/clients/hilton.jpg',
    issue: 'Inactive for 7 days',
    color: '#D40101'
  },
  {
    name: 'Hilton Santana',
    image: '/images/clients/hilton.jpg',
    issue: 'No meal logs for 5 days',
    color: '#D40101'
  },
  {
    name: 'Hilton Santana',
    image: '/images/clients/hilton.jpg',
    issue: 'No meal logs for 5 days',
    color: '#D40101'
  },
  {
    name: 'Hilton Santana',
    image: '/images/clients/hilton.jpg',
    issue: 'No meal logs for 5 days',
    color: '#D40101'
  },
  {
    name: 'Hilton Santana',
    image: '/images/clients/hilton.jpg',
    issue: 'No meal logs for 5 days',
    color: '#D40101'
  }
]

const MobileFlaggedIssues = () => {
  return (
    <div className="bg-[#F3F7F3] rounded-[20px] p-4">
      <h3 className="text-[18px] font-bold text-[#2B180A] mb-4">
        Flagged Issues
      </h3>
      <div className="space-y-[11px]">
        {flaggedIssues.map((issue, index) => (
          <div
            key={index}
            className="flex justify-between items-center px-[18px] py-2 bg-white rounded-[110px]"
          >
            <div className="flex items-center gap-[10px]">
              <div className="w-[30px] h-[30px] rounded-full overflow-hidden bg-gray-200">
                <Image 
                  src={issue.image} 
                  alt={issue.name} 
                  width={30} 
                  height={30}
                  className="object-cover"
                />
              </div>
              <span className="text-[14px] font-medium text-[#1E1E1E]">
                {issue.name}
              </span>
            </div>
            <span className="text-[14px] font-medium text-[#D40101]">
              {issue.issue}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default MobileFlaggedIssues 