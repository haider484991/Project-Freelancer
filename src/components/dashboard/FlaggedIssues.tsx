import Image from 'next/image'

const flaggedIssues = [
  {
    name: 'Hilton Santana',
    image: '/images/clients/hilton.jpg',
    issue: 'Inactive for 7 days'
  },
  {
    name: 'Sarah Johnson',
    image: '/images/clients/sarah.jpg',
    issue: 'Missed last check-in'
  },
  {
    name: 'Mike Chen',
    image: '/images/clients/mike.jpg',
    issue: 'No meal logs for 5 days'
  },
  {
    name: 'Emma Wilson',
    image: '/images/clients/emma.jpg',
    issue: 'Missed workout session'
  },
  {
    name: 'James Brown',
    image: '/images/clients/james.jpg',
    issue: 'Below protein target'
  },
  {
    name: 'Lisa Anderson',
    image: '/images/clients/lisa.jpg',
    issue: 'Missed weekly weigh-in'
  }
]

const FlaggedIssues = () => {
  return (
    <div className="bg-[#F3F7F3] rounded-[20px] p-8">
      <h3 className="text-[18px] font-bold text-[#2B180A] mb-8">
        Flagged Issues
      </h3>
      <div className="space-y-3">
        {flaggedIssues.map((issue, index) => (
          <div
            key={index}
            className="flex justify-between items-center px-[18px] py-2 bg-white rounded-[110px]"
          >
            <div className="flex items-center gap-[15px]">
              <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200">
                <Image 
                  src={issue.image} 
                  alt={issue.name} 
                  width={40} 
                  height={40}
                  className="object-cover"
                />
              </div>
              <span className="text-[16px] font-medium text-[#1E1E1E]">
                {issue.name}
              </span>
            </div>
            <span className="text-[16px] font-medium text-[#D40101]">
              {issue.issue}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default FlaggedIssues 