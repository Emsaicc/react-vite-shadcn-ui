import { useNavigate } from 'react-router-dom';

const UserProfileCard = ({ user, isOpen }: { user: any, isOpen: boolean }) => {

  const navigate = useNavigate();
  return (
    <div  className={`relative hover:cursor-pointer flex items-center p-4 bg-white border rounded-lg shadow-md w-full ${isOpen ? 'block' : 'hidden'}`} onClick={()=>{
      navigate('/ajustes/perfil')
    }}>
      <div className="relative w-8 h-8 mr-4">
        <img
          className="rounded-full w-full h-full object-cover"
          src={`${user?.imagen ? user?.imagen : "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png?20150327203541"}`}
          alt="User Profile"
        />
      </div>
      <div className="flex-grow">
        <h2 className="text-sm font-medium">{user.nombre} {user.apellido}</h2>
      
      </div>
    </div>
  );
};

export default UserProfileCard;
