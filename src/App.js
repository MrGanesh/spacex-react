import React, { useState, useEffect } from 'react';
import { Table } from 'reactstrap';
import './Example.css';
import ReactPaginate from 'react-paginate';
import ModalExample from './ModalExample';
import Calendar from 'react-calendar';
import Moment from 'moment';

const App = props => {
  const [start, setStart] = useState(new Date());
  const [end, setEnd] = useState(new Date());
  const [modal, setModal] = useState(false);
  const [ind, setInd] = useState(0);
  const toggle = index => {
    setModal(!modal);
    setInd(index);
  };
  const [currentPage, setCurrentPage] = useState(0);
  const [data, setData] = useState([]);

  // calendar
  const [date, setDate] = useState(new Date());

  const dateChange = date => {
    setDate(date);
  };

  const PER_PAGE = 10;
  const offset = currentPage * PER_PAGE;
  const currentPageData = data
    .slice(offset, offset + PER_PAGE)
    .map((item, index) => {
      return (
        <tr>
          <td>{item.flight_number}</td>
          <td>{item.launch_date_utc}</td>
          <td>{item.launch_site?.site_name}</td>
          <td
            onClick={() => toggle(index)}
            data-toggle="modal"
            data-target="#exampleModalCenter"
            style={{ cursor: 'pointer' }}
          >
            {item.mission_name}

            <>
              <div
                class="modal fade"
                id="exampleModalCenter"
                tabindex="-1"
                role="dialog"
                aria-labelledby="exampleModalCenterTitle"
                aria-hidden="true"
              >
                <div class="modal-dialog modal-dialog-centered" role="document">
                  <div class="modal-content">
                    <div class="modal-header row">
                      <div className="col-sm-2 col-6 imgleft">
                        <img
                          src={data[ind].links?.mission_patch}
                          width="72px"
                          height="72px"
                        />
                      </div>
                      <div
                        className="col-sm-4 col-6"
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'flex-start',
                          alignItems: 'center'
                        }}
                      >
                        <h5>{data[ind].mission_name}</h5>
                        <h6>{data[ind].rocket?.rocket_name}</h6>
                      </div>
                      <span>
                        {' '}
                        {data[ind].launch_failure_details
                          ? 'Failed'
                          : `${
                              data[ind].launch_success ? 'Success' : 'Upcoming'
                            }`}
                      </span>
                      <button
                        type="button"
                        class="close"
                        data-dismiss="modal"
                        aria-label="Close"
                      >
                        <span aria-hidden="true">&times;</span>
                      </button>
                    </div>
                    <div class="modal-body">
                      <p>{data[ind].details}</p>
                    </div>

                    <div class="table-responsive">
                      <table class="table table-md">
                        <tbody>
                          <tr>
                            <td>Flight Number</td>
                            <td>{data[ind].flight_number}</td>
                          </tr>
                          <tr>
                            <td>Mission Name</td>
                            <td>{data[ind].mission_name}</td>
                          </tr>
                          <tr>
                            <td>Rocket Type</td>
                            <td>{data[ind].rocket?.rocket_type}</td>
                          </tr>
                          <tr>
                            <td>Rocket Name</td>
                            <td>{data[ind].rocket?.rocket_name}</td>
                          </tr>
                          <tr>
                            <td>Manifactures</td>
                            <td>
                              {
                                data[ind].rocket?.second_stage.payloads[0]
                                  ?.manufacturer
                              }
                            </td>
                          </tr>
                          <tr>
                            <td>Nationality</td>
                            <td>
                              {
                                data[ind].rocket?.second_stage.payloads[0]
                                  ?.nationality
                              }
                            </td>
                          </tr>
                          <tr>
                            <td>Launch Date</td>
                            <td>{data[ind].launch_date_utc}</td>
                          </tr>
                          <tr>
                            <td>Payload Type</td>
                            <td>
                              {
                                data[ind].rocket?.second_stage.payloads[0]
                                  ?.payload_type
                              }
                            </td>
                          </tr>
                          <tr>
                            <td>Orbit</td>
                            <td>
                              {
                                data[ind].rocket?.second_stage.payloads[0]
                                  ?.orbit
                              }
                            </td>
                          </tr>
                          <tr>
                            <td>Launch Site</td>
                            <td>{data[ind].launch_site?.site_name}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </>
          </td>
          <td>{item.rocket?.second_stage.payloads[0]?.orbit}</td>
          <td>
            {item.launch_failure_details
              ? 'Failed'
              : `${item.launch_success ? 'Success' : 'Upcoming'}`}
          </td>
          <td>{item.rocket?.rocket_name}</td>
        </tr>
      );
    });

  const pageCount = Math.ceil(data.length / PER_PAGE);

  // const viewModal=(item)=>{
  //    setModal(!modal)
  //    console.log("data",data)
  //    console.log("toggle",modal)
  //    return(
  //     <ModalExample data={item} toggle={modal} />
  //    )
  // }

  useEffect(() => {
    fetchData();
  }, []);

  function fetchData() {
    fetch('https://api.spacexdata.com/v3/launches', {
      method: 'get'
    })
      .then(res => res.json())
      .then(data => {
        console.log('all launches', data);
        setData(data);
      });
  }

  function handlePageClick({ selected: selectedPage }) {
    setCurrentPage(selectedPage);
  }

  const upcomingChange = () => {
    fetch('https://api.spacexdata.com/v3/launches/upcoming', {
      method: 'get'
    })
      .then(res => res.json())
      .then(data => {
        console.log('upcoming data', data);
        setData(data);
      });
  };
  const successChange = () => {
    fetch('https://api.spacexdata.com/v3/launches/past', {
      method: 'get'
    })
      .then(res => res.json())
      .then(data => {
        const result = data.filter(item => item.launch_success == true);
        setData(result);
        console.log('success data', result);
      });
  };
  const failedChange = () => {
    fetch('https://api.spacexdata.com/v3/launches/past', {
      method: 'get'
    })
      .then(res => res.json())
      .then(data => {
        const result = data.filter(item => item.launch_success == false);
        setData(result);
        console.log('failed data', result);
      });
  };

  const handleFilter = e => {
    console.log('dropdown data', e.target.value);
    if (e.target.value == 'All') {
      fetchData();
    } else if (e.target.value == 'Upcoming') {
      upcomingChange();
    } else if (e.target.value == 'Successful') {
      successChange();
    } else if (e.target.value == 'Failed') {
      failedChange();
    }
  };

  const handleCalendar = e => {
    e.preventDefault();
    let newData = data.map(item => {
      return Moment(item.launch_date_utc).format('YYYY-MM-DD');
    });

    let startDate = Moment(start).format('YYYY-MM-DD');
    let endDate = Moment(end).format('YYYY-MM-DD');

     let yesterday=new Date(new Date().getTime() - (1 * 24 * 60 * 60 * 1000));
   
    //Past week logic

        let last7days=new Date(new Date().getTime() - (1095 * 24 * 60 * 60 * 1000));
  console.log("last7Days", last7days)
  var filteredDateslast7days=newData.filter(p => new Date(p) <= yesterday && new Date(p) >= last7days); 
       
       
         console.log('filteredDateslast7days', filteredDateslast7days);


    //Past month logic

            let lastMonth=new Date(new Date().getTime() - (1095 * 24 * 60 * 60 * 1000));
  console.log("lastMonth", lastMonth)
  var filteredDatesMonth=newData.filter(p => new Date(p) <= yesterday && new Date(p) >= lastMonth); 
       
        
         console.log('filteredDatesMonth', filteredDatesMonth);
       

    //Past 3 month logic

       
       let last3Month=new Date(new Date().getTime() - (1095 * 24 * 60 * 60 * 1000));
  console.log("last3Month", last3Month)
  var filteredDates3Month=newData.filter(p => new Date(p) <= yesterday && new Date(p) >= last3Month); 
         console.log("filteredDates3Month", filteredDates3Month)
       

    //Past 6 month logic

         let last6Month=new Date(new Date().getTime() - (1095 * 24 * 60 * 60 * 1000));
  console.log("last6Month", last6Month)
  var filteredDates6month=newData.filter(p => new Date(p) <= yesterday && new Date(p) >= last6Month); 
         console.log("filteredDates6month", filteredDates6month)
       

       
    
    
    //Past 12 month logic
 let last12Month=new Date(new Date().getTime() - (1095 * 24 * 60 * 60 * 1000));
  console.log("last12Month", last12Month)
  var filteredDates12month=newData.filter(p => new Date(p) <= yesterday && new Date(p) >= last12Month); 
         console.log("filteredDates12month", filteredDates12month)
       
   
       
    //Past 36 month logic

      
  let last36month=new Date(new Date().getTime() - (1095 * 24 * 60 * 60 * 1000));
  console.log("last7Days", last36month)
  var filteredDates36month=newData.filter(p => new Date(p) <= yesterday && new Date(p) >= last36month); 
       
        //  const filteredDates36month = newData.filter(d =>  currDate - new Date(d) > 1000);
         console.log('filteredDates36month', filteredDates36month);
       

    let result = newData.map(item => {
      if (Moment(item).isBetween(startDate, endDate)) {
        return item;
      }
    });
    result = result.filter(item => item);

    let resultData = data.map(item => {
      if (result.includes(Moment(item.launch_date_utc).format('YYYY-MM-DD'))) {
        return item;
      }
      
    });
    resultData = resultData.filter(item => item);
    setData(resultData);

    console.log('date ', resultData);
  };

  return (
    <div className="container">
      <div className="logo mb-2">
        <svg
          width="260"
          height="32"
          viewBox="0 0 260 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g clip-path="url(#clip0)">
            <path
              d="M60.5949 11.8312H38.61L37.7954 12.4402V31.9945H43.8814V24.6617L44.4623 24.1413H60.5957C64.6692 24.1413 66.579 23.0455 66.579 20.2339V15.7441C66.5782 12.9278 64.6692 11.8312 60.5949 11.8312ZM60.5949 19.0605C60.5949 20.3851 59.7184 20.6603 57.8087 20.6603H44.529L43.8806 20.0301V15.8413L44.4615 15.3098H57.8087C59.7184 15.3098 60.5949 15.5818 60.5949 16.9128V19.0605Z"
              fill="#005288"
            />
            <path
              d="M77.6768 15.5301L82.9138 23.2015L82.6237 23.9445H71.0421L68.0857 27.5808H85.3253L86.52 28.3082L89.1965 31.9992H96.1613L80.895 11.5811"
              fill="#005288"
            />
            <path
              d="M146.931 28.0275V22.6003L147.557 22.0594H159.208V18.6035H140.742V31.9984H167.982V28.559H147.584"
              fill="#005288"
            />
            <path
              d="M168.27 11.8312H140.742V15.6312H168.27V11.8312Z"
              fill="#005288"
            />
            <path
              d="M110.039 15.4297H132.216C131.875 12.6103 130.125 11.828 125.686 11.828H109.803C104.795 11.828 103.197 12.8055 103.197 16.5953V27.228C103.197 31.0218 104.795 31.9992 109.803 31.9992H125.686C130.19 31.9992 131.915 31.1534 132.032 28.229H110.039L109.387 27.6152V15.8405"
              fill="#005288"
            />
            <path
              d="M22.9963 19.6883H6.86295L6.38787 19.1655V15.7151L6.8606 15.3498H28.6096L28.9067 14.6232C28.1659 12.7177 26.2475 11.8288 22.6851 11.8288H7.57715C2.57149 11.8288 0.971397 12.8063 0.971397 16.5961V18.8253C0.971397 22.6199 2.57149 23.5957 7.57715 23.5957H23.6745L24.1801 24.0394V27.6466L23.7678 28.2094H5.35459V28.1921H0.531588C0.531588 28.1921 -0.0203295 28.4688 0.000837798 28.5982C0.412424 31.2491 2.2187 32 6.54309 32H22.9963C28.0012 32 29.6491 31.0226 29.6491 27.2288V24.4517C29.6491 20.6642 28.0012 19.6883 22.9963 19.6883Z"
              fill="#005288"
            />
            <path
              d="M185.586 11.7481H176.53L176.039 12.6832L186.096 20.0128C188.001 18.91 190.074 17.7922 192.328 16.6894"
              fill="#005288"
            />
            <path
              d="M193.7 25.5553L202.54 32H211.706L212.085 31.1464L198.886 21.4872C197.133 22.7735 195.401 24.1319 193.7 25.5553Z"
              fill="#005288"
            />
            <path
              d="M184.238 31.9851H176.045L175.353 30.9011C180.924 25.5232 205.84 2.46986 260 0C260 0 214.54 1.53318 184.238 31.9851Z"
              fill="#A7A9AC"
            />
          </g>
          <defs>
            <clipPath id="clip0">
              <rect width="260" height="32" fill="white" />
            </clipPath>
          </defs>
        </svg>
      </div>

      <div className="row">
        <div className="col-sm-3 mb-4 float-left col-6">
          <div class="dropdown">
            <div className="leftBtn">Mouse over me</div>
            <div className="dropdown-content row">
              <div className="row">
                <p>Past Week </p>
                <p>Past Month </p>
                <p>Past 3 Month </p>
              </div>
              <form className="row">
                <input
                  className="form-control mt-2"
                  type="date"
                  value={start}
                  onChange={e => {
                    setStart(e.target.value);
                  }}
                  id="example-date-input"
                />
                <input
                  classNAme="form-control mt-2"
                  type="date"
                  value={end}
                  onChange={e => {
                    setEnd(e.target.value);
                  }}
                  id="example-date-input"
                />
                <button
                  className="btn btn-primary form-control mt-2"
                  onClick={e => handleCalendar(e)}
                >
                  sort
                </button>
              </form>
            </div>
          </div>

          {/* 

          <div class="dropdown">
            <button
              class="btn btn-light dropdown-toggle"
              type="button"
              id="dropdownMenuButton"
              data-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false"
           
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M10.3333 1.99996H12.9999C13.1767 1.99996 13.3463 2.0702 13.4713 2.19522C13.5963 2.32025 13.6666 2.48981 13.6666 2.66663V13.3333C13.6666 13.5101 13.5963 13.6797 13.4713 13.8047C13.3463 13.9297 13.1767 14 12.9999 14H0.999919C0.823108 14 0.653538 13.9297 0.528514 13.8047C0.40349 13.6797 0.333252 13.5101 0.333252 13.3333V2.66663C0.333252 2.48981 0.40349 2.32025 0.528514 2.19522C0.653538 2.0702 0.823108 1.99996 0.999919 1.99996H3.66659V0.666626H4.99992V1.99996H8.99992V0.666626H10.3333V1.99996ZM8.99992 3.33329H4.99992V4.66663H3.66659V3.33329H1.66659V5.99996H12.3333V3.33329H10.3333V4.66663H8.99992V3.33329ZM12.3333 7.33329H1.66659V12.6666H12.3333V7.33329Z"
                  fill="#4B5563"
                />
              </svg>
       
              Past 6 months
            </button>
            <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
              <a class="dropdown-item" href="#">
                Past Week
              </a>
              <a class="dropdown-item" href="#">
               Past Month
              </a>
            
            
            </div>
          </div> */}

          {/* <select class="form-select" aria-label="Default select example" onChange={(e)=>handleCalendar(e)}>
  <option selected>Past 6 months</option>
  <option value="week">past week</option>
  <option value="month"> past month</option>
  <option value="3month"> last 3 months</option>
  </select> */}

          {/* <button>
  <Calendar onChange={dateChange}
              value={date} />
              </button> */}

          {/*    
  <form className='row'>
  <input class="form-control" type="date" value={start} onChange={(e)=>{setStart(e.target.value)}} id="example-date-input" />
  <input class="form-control" type="date" value={end} onChange={(e)=>{setEnd(e.target.value)}} id="example-date-input" />
  <button onClick={(e)=>handleCalendar(e)}>
    sort
  </button>
  </form> */}
        </div>

        <div className="col-sm-6" />
        <div className="col-sm-3 mb-4 float-right col-6">
          {/* <div class="dropdown">
            <button
              class="btn btn-light dropdown-toggle"
              type="button"
              id="dropdownMenuButton"
              data-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false"
            >
              <svg
                width="12"
                height="13"
                viewBox="0 0 12 13"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 0.666656V1.99999H11.3333L8 6.99999V12.6667H4V6.99999L0.666667 1.99999H0V0.666656H12ZM2.26933 1.99999L5.33333 6.59599V11.3333H6.66667V6.59599L9.73067 1.99999H2.26933Z"
                  fill="#4B5563"
                />
              </svg>
              All Launches
            </button>
            <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
              <a class="dropdown-item" href="#">
                All Launches
              </a>
              <a class="dropdown-item" onClick={upcomingChange}>
                Upcoming Launches
              </a>
              <a class="dropdown-item" href="#">
                Successful Launches
              </a>
              <a class="dropdown-item" href="#">
                Failed Launches
              </a>
            </div>
          </div>
        */}

          <select
            class="form-select"
            aria-label="Default select example"
            onChange={e => handleFilter(e)}
          >
            <option selected>All Launches</option>
            <option value="All">All Launches</option>
            <option value="Upcoming"> Upcoming Launches</option>
            <option value="Successful"> Successful Launches</option>
            <option value="Failed"> Failed Launches</option>
          </select>
        </div>
      </div>

      <div className="table-data">
        <Table>
          <thead>
            <tr>
              <th>No:</th>
              <th>Launched (UTC)</th>
              <th>Location</th>
              <th>Mission</th>
              <th>Orbit</th>
              <th>Launch Status</th>
              <th>Rocket</th>
            </tr>
          </thead>

          {data ? <tbody>{currentPageData}</tbody> : <h6> No data found </h6>}
        </Table>
      </div>

      <div className="paginate">
        <ReactPaginate
          previousLabel={'<'}
          nextLabel={'>'}
          pageCount={pageCount}
          onPageChange={handlePageClick}
          containerClassName={'pagination'}
          previousLinkClassName={'pagination__link'}
          nextLinkClassName={'pagination__link'}
          disabledClassName={'pagination__link--disabled'}
          activeClassName={'pagination__link--active'}
        />
      </div>
    </div>
  );
};

export default App;
