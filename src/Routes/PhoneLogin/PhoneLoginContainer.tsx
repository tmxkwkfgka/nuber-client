import React from "react";
import { Mutation  } from "react-apollo";
import { RouteComponentProps } from 'react-router-dom';
import { toast } from "react-toastify";
import {
  startPhoneVerification,
  startPhoneVerificationVariables,
 
} from "../../types/api";
import PhoneLoginPresenter from "./PhoneLoginPresenter";
import { PHONE_SIGN_IN } from "./PhoneQueries";

interface IState {
    countryCode: string;
    phoneNumber: string;
  }


  
  // any는 뮤테이션이 리턴하는 데이터
  // interface Idata{ ok , boolean}
  class PhoneSignInMutation extends Mutation<startPhoneVerification, startPhoneVerificationVariables> {}
  

  class PhoneLoginContainer extends React.Component<
  RouteComponentProps<any>,
  IState
> {
  public state = {
    countryCode: "+82",
    phoneNumber: ""
  };

  public render() {
    // history는 react router에서 주는거
    const {history} = this.props;
    const { countryCode, phoneNumber } = this.state;
    return (
        <PhoneSignInMutation
        mutation={PHONE_SIGN_IN}
        variables={{
          phoneNumber: `${countryCode}${phoneNumber}`
        }}
        onCompleted={data=>{
          const {StartPhoneVerification} = data;
          const phone = `${countryCode}${phoneNumber}`;
          if(StartPhoneVerification.ok){
            toast.success("SMS Sent! Redirecting you...");
            setTimeout(() => {
              history.push({
                pathname: "/verify-phone",
                state: {
                  phone
                }
              });
            }, 2000);
          }else{
            toast.error(StartPhoneVerification.error);
          }
        }}
        >
        {(mutation, { loading }) => {
          const onSubmit: React.FormEventHandler<HTMLFormElement> = event => {
            event.preventDefault();
           
            const phone = `${countryCode}${phoneNumber}`;
            const isValid = /^\+[1-9]{1}[0-9]{7,11}$/.test(phone);
            if (isValid) {
             
             mutation();
            } else {
              toast.error("Please write a valid phone number");
            }
          };
          return (
            <PhoneLoginPresenter
              countryCode={countryCode}
              phoneNumber={phoneNumber}
              onInputChange={this.onInputChange}
              onSubmit={onSubmit}
              loading={loading}
            />
          );
        }}
      </PhoneSignInMutation>
    );
  }
  public onInputChange: React.ChangeEventHandler<HTMLInputElement | HTMLSelectElement> = (event)=>{
      // input 또는 select인데 두개다 name 있음
    const {target : {name, value}} = event;
    this.setState({
        // [name]이 countrycode일수도 phonnumber일수도 바귀는 놈 갖고 옴
        [name]: value
    } as any) 
  } 

  public onSubmit: React.FormEventHandler<HTMLFormElement> = (event)=>{
    event.preventDefault();
    const {countryCode, phoneNumber} = this.state;
    // tslint:disable-next-line
    const isValid = /^\+[1-9]{1}[0-9]{7,11}$/.test(
        `${countryCode}${phoneNumber}`
      );
      if (isValid) {
        
        return;
      } else {
        toast.error("Please write a valid phone number");
      }
  }

  



}

export default PhoneLoginContainer;