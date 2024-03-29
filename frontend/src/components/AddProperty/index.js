import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink, Route, useParams, useHistory } from 'react-router-dom';
import { postProperites } from '../../store/properties'
import { getGMapKey } from '../../store/maps';
import './NewPropertyAdd.css'


const NewPropertyAdd = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const sessionUser = useSelector(state => state.session.user);
  const key = useSelector((state) => state.maps.googleAPIKey);
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [postal, setPostal] = useState('');
  const [errors, setErrors] = useState([]);
  const [addOpen, setAddOpen] = useState(false)

  useEffect (() => {
    setErrors([])
  }, [state, postal])

  useEffect (() => {
    setStreet('')
    setCity('')
    setState('')
    setPostal('')
  }, [addOpen])

  useEffect(() => {
    if (!key) {
      dispatch(getGMapKey());
    }
  }, [dispatch, key]);


  const handleSubmit = async (e) => {
    e.preventDefault();
    const userId = sessionUser.id

    const regExState = /^(?:(A[KLRZ]|C[AOT]|D[CE]|FL|GA|HI|I[ADLN]|K[SY]|LA|M[ADEINOST]|N[CDEHJMVY]|O[HKR]|P[AR]|RI|S[CD]|T[NX]|UT|V[AIT]|W[AIVY]))$/

    const regExPostal = /^\d{5}$/

    if (regExState.test(state) && regExPostal.test(postal)) {

    setErrors([])

    let address = `${street}, ${city}, ${state}, ${postal}`

    const geocode = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${key}`)
    const res = await geocode.json()
    let lat = 0
    let long = 0
    console.log(res)
    if (res.results && res.results[0] && res.results[0].geometry) {
        lat = res.results[0].geometry.location.lat;
        long = res.results[0].geometry.location.lng;
    }

    if (lat === 0 || long === 0) {
      return alert('Propety entered was not found, please try a different address.')
    }

    if (key) {
      console.log(lat, long)
      const payload = {
        lat,
        long,
        street,
        city,
        state,
        postal,
        userId
      };

      dispatch(postProperites(payload))
        .catch(async (res) => {
          const data = await res.json();
          if (data && data.errors) setErrors(data.errors);
        });

        setAddOpen(!addOpen);
      };
    }



   if (regExState.test(state) === false) {
     return setErrors(['Valid 2 letter state abbreviations only.'])
   }

   if (regExPostal.test(postal) === false) {
    return setErrors(['Postal code must be 5 digits.'])
   }


  };

  return (
    <div>
      <button  onClick={() => setAddOpen(!addOpen)} className='AddNewPropButton'>+ Add New Property</button>
      { addOpen &&
      <div className='AddPropertyForm'>
        <h3 id='property-create-header'>Add New Property:</h3>
        <form autoComplete="off" className='AddPropertyFormInner' onSubmit={handleSubmit}>
            {errors.length > 0 &&
              <ul  className='ErrorList'>
                  {errors.map((error, idx) => <li key={idx}>{error}</li>)}
              </ul>
            }
          <label  className='AddPropertyFormLvl1'>
            Street
            <input
              type="text"
              value={street}
              onChange={(e) => setStreet(e.target.value)}
              required
              className='AddPropertyFormLvl2'
            />
          </label>
          <label  className='AddPropertyFormLvl1'>
            City
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              required
              className='AddPropertyFormLvl2'
            />
          </label>
          <label  className='AddPropertyFormLvl1'>
            State
            <input
              type="text"
              value={state}
              onChange={(e) => setState(e.target.value)}
              required
              className='AddPropertyFormLvl2'
            />
          </label>
          <label  className='AddPropertyFormLvl1'>
            Postal
            <input
              type="text"
              value={postal}
              onChange={(e) => setPostal(e.target.value)}
              required
              className='AddPropertyFormLvl2'
            />
          </label>
          <button type="submit" className='AddPropertyFormLvl3'>+ Add</button>
        </form>
        <button className='AddPropertyFormLvl3' onClick={() => setAddOpen(false)}>Cancel</button>
      </div>
      }
    </div>
  );
}

export default NewPropertyAdd
