import { useNavigate } from 'react-router-dom';
import { ArrowRight, Building2, GraduationCap, UserRound, Users } from 'lucide-react';
import { useApp } from '../context/AppContext';

const VIEWS = [
  {
    userId: 'u1',
    title: 'University',
    role: 'Dean of Student Affairs',
    desc: 'Create accounts and assign offices, send official notices, approve reports, oversee finances and hand over between tenures.',
    icon: Building2,
  },
  {
    userId: 'u2',
    title: 'Association Executive',
    role: 'President',
    desc: 'Run the Association day to day: notices, reports, members, events, dues, tasks and documents.',
    icon: Users,
  },
  {
    userId: 'u8',
    title: 'Member',
    role: 'Association member',
    desc: 'Follow announcements, see upcoming events and read the constitution and other documents.',
    icon: UserRound,
  },
];

export default function Home() {
  const { switchUser } = useApp();
  const navigate = useNavigate();

  const open = (userId) => {
    switchUser(userId);
    navigate('/app/dashboard');
  };

  return (
    <div className="home">
      <div className="home-inner">
        <div className="home-brand">
          <span className="brand-mark">
            <GraduationCap size={22} />
          </span>
          <span>
            <strong>KWASU</strong>
            <small>Association Platform</small>
          </span>
        </div>

        <h1>Choose a view</h1>

        <div className="view-cards">
          {VIEWS.map((v) => (
            <button key={v.userId} className="view-card" onClick={() => open(v.userId)}>
              <span className="view-icon">
                <v.icon size={24} />
              </span>
              <strong>{v.title}</strong>
              <span className="view-role">{v.role}</span>
              <p>{v.desc}</p>
              <span className="view-open">
                Open <ArrowRight size={16} />
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
