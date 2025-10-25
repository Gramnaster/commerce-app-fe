const socialLists = [
  {
    id: 0,
    Community: ['Facebook', 'Twitter', 'Youtube', 'Bluesky', 'Instagram'],
  },
  {
    id: 1,
    'Our Company': [
      'About',
      'Careers',
      'News',
      'Legal',
      'Terms',
      'Privacy',
      'Blog',
    ],
  },
  {
    id: 2,
    Support: [
      '24/7 Chat Support',
      'Virtual Assistant',
      'Feedback',
      'Referrals',
      'Bug Reports',
      'Law Enforcements',
    ],
  },
];

const Footer = () => {
  const lastCommitDate = import.meta.env.VITE_LAST_COMMIT_DATE || 'Unknown';
  return (
  <div className="flex flex-col w-full h-[450px] min-h-[450px] max-h-[450px] mt-10 bg-primary font-secondary font-light items-center justify-center">
      <div className="flex flex-row text-left gap-x-5 items-center justify-center h-full">
        {socialLists.map((socialList) => {
          return (
            <ul
              className="w-[280px] h-[300px] p-5 bg-[#001A33] rounded-lg flex flex-col"
              key={socialList.id}
            >
              <h1 className="text-lg font-bold mb-3">
                {Object.keys(socialList)[1]}
              </h1>
              <ul className="text-sm font-light flex flex-col gap-y-3">
                {Object.values(socialList)[1].map(
                  (links: string, index: number) => {
                    return (
                      <li key={`${socialList.id}-${index}`}>
                        <p>{links}</p>
                      </li>
                    );
                  }
                )}
              </ul>
            </ul>
          );
        })}
      </div>
      <div className="pb-5">
        <p className="text-base">JP&B 2025. © Copyright. All Rights Reserved. Last Updated {lastCommitDate}.</p>
      </div>
    </div>
  );
};
export default Footer;
