import React from "react";
import image from "./image.svg";
import line1 from "./line-1.svg";
import lomba1 from "./lomba-1.png";
import vector2 from "./vector-2.svg";
import vector3 from "./vector-3.svg";
import vector4 from "./vector-4.svg";
import vector from "./vector.svg";

export const Slide = () => {
  return (
    <div className="bg-white flex flex-row justify-center w-full">
      <div className="bg-white overflow-hidden w-[1920px] h-[1080px] relative">
        <div className="absolute w-[1920px] h-[173px] top-[-52px] left-[-98px]">
          <div className="absolute w-[1920px] h-[120px] top-0 left-0 bg-white" />

          <div className="absolute w-[305px] h-[68px] top-[74px] left-[158px]">
            <div className="relative w-[303px] h-[68px]">
              <div className="absolute w-[300px] h-[68px] top-0 left-0 bg-[#d9d9d9] opacity-50" />

              <div className="absolute w-[303px] top-2.5 left-0 [font-family:'Poppins-Regular',Helvetica] font-normal text-black text-[32px] text-center tracking-[0] leading-[48.0px] whitespace-nowrap">
                Android Developer
              </div>
            </div>
          </div>

          <div className="absolute w-[293px] h-[47px] top-[84px] left-[518px]">
            <div className="absolute w-[291px] top-0 left-0 [font-family:'Poppins-Regular',Helvetica] font-normal text-black text-[32px] text-center tracking-[0] leading-[48.0px] whitespace-nowrap">
              Front End Website
            </div>
          </div>

          <div className="absolute w-[323px] h-[47px] top-[85px] left-[868px]">
            <div className="absolute w-[321px] top-0 left-0 [font-family:'Poppins-Regular',Helvetica] font-normal text-black text-[32px] text-center tracking-[0] leading-[48.0px] whitespace-nowrap">
              Back End Developer
            </div>
          </div>

          <div className="absolute w-[293px] h-[47px] top-[84px] left-[1248px]">
            <div className="absolute w-[291px] top-0 left-0 [font-family:'Poppins-Regular',Helvetica] font-normal text-black text-[32px] text-center tracking-[0] leading-[48.0px] whitespace-nowrap">
              Machine Learning
            </div>
          </div>

          <div className="absolute w-[140px] h-[47px] top-[84px] left-[1659px]">
            <div className="relative w-[142px] h-[47px]">
              <div className="absolute w-[140px] top-0 left-0 [font-family:'Poppins-Regular',Helvetica] font-normal text-black text-[32px] text-center tracking-[0] leading-[48.0px] whitespace-nowrap">
                All Class
              </div>
            </div>
          </div>

          <img
            className="absolute w-px h-[121px] top-[52px] left-[1598px] object-cover"
            alt="Line"
            src={line1}
          />
        </div>

        <div className="absolute w-[93px] h-[47px] top-[445px] left-[359px]">
          <div className="absolute w-[91px] top-0 left-0 [font-family:'Poppins-Regular',Helvetica] font-normal text-black text-[32px] tracking-[0] leading-[48.0px] whitespace-nowrap">
            Kotlin
          </div>
        </div>

        <img
          className="absolute w-[1920px] h-[260px] top-[121px] left-0 object-cover"
          alt="Lomba"
          src={lomba1}
        />

        <div className="absolute w-[545px] h-[210px] top-[507px] left-[324px] bg-[#d9d9d9] rounded-[25px] border border-solid border-black">
          <div className="relative w-[386px] h-[100px] top-[54px] left-20">
            <div className="absolute w-16 h-16 top-0 left-0">
              <img
                className="absolute w-12 h-12 top-2 left-2"
                alt="Vector"
                src={image}
              />
            </div>

            <div className="absolute w-[254px] h-[47px] top-2 left-[82px]">
              <div className="absolute w-[252px] top-0 left-0 [font-family:'Poppins-Regular',Helvetica] font-normal text-black text-[32px] tracking-[0] leading-[48.0px] whitespace-nowrap">
                Instalasi Kotlin
              </div>
            </div>

            <div className="absolute w-80 h-[22px] top-[74px] left-2 bg-[#36ff3a] rounded-[35px]" />

            <div className="absolute w-[50px] top-[70px] left-[334px] [font-family:'Poppins-Light',Helvetica] font-light text-black text-xl text-center tracking-[0] leading-[30.0px] whitespace-nowrap">
              100%
            </div>
          </div>
        </div>

        <div className="absolute w-[545px] h-[210px] top-[504px] left-[1051px] bg-[#d9d9d9] rounded-[25px] border border-solid border-black">
          <div className="relative w-[386px] h-[100px] top-[57px] left-20">
            <div className="absolute w-16 h-16 top-0 left-0">
              <img
                className="absolute w-12 h-12 top-2 left-2"
                alt="Vector"
                src={vector4}
              />
            </div>

            <div className="absolute w-[254px] h-[47px] top-2 left-[82px]">
              <div className="absolute w-[252px] top-0 left-0 [font-family:'Poppins-Regular',Helvetica] font-normal text-black text-[32px] tracking-[0] leading-[48.0px] whitespace-nowrap">
                Inisialisasi Data
              </div>
            </div>

            <div className="absolute w-80 h-[22px] top-[74px] left-2 bg-[#36ff3a] rounded-[35px]" />

            <div className="absolute w-[50px] top-[70px] left-[334px] [font-family:'Poppins-Light',Helvetica] font-light text-black text-xl text-center tracking-[0] leading-[30.0px] whitespace-nowrap">
              100%
            </div>
          </div>
        </div>

        <div className="absolute w-[545px] h-[210px] top-[802px] left-[1051px] bg-[#d9d9d9] rounded-[25px] border border-solid border-black">
          <div className="relative w-[386px] h-[100px] top-[50px] left-20">
            <div className="absolute w-16 h-16 top-0 left-0">
              <img
                className="absolute w-12 h-12 top-2 left-2"
                alt="Vector"
                src={vector3}
              />
            </div>

            <div className="absolute w-[254px] h-[47px] top-2 left-[82px]">
              <div className="absolute w-[252px] top-0 left-0 [font-family:'Poppins-Regular',Helvetica] font-normal text-black text-[32px] tracking-[0] leading-[48.0px] whitespace-nowrap">
                Instalasi Kotlin
              </div>
            </div>

            <div className="absolute w-80 h-[22px] top-[74px] left-2 bg-[#36ff3a] rounded-[35px]" />

            <div className="absolute w-[50px] top-[70px] left-[334px] [font-family:'Poppins-Light',Helvetica] font-light text-black text-xl text-center tracking-[0] leading-[30.0px] whitespace-nowrap">
              100%
            </div>
          </div>
        </div>

        <div className="absolute w-[545px] h-[210px] top-[802px] left-[324px] bg-[#d9d9d9] rounded-[25px] border border-solid border-black">
          <div className="relative w-[386px] h-[100px] top-[54px] left-20">
            <div className="absolute w-16 h-16 top-0 left-0">
              <img
                className="absolute w-12 h-12 top-2 left-2"
                alt="Vector"
                src={vector2}
              />
            </div>

            <div className="absolute w-[254px] h-[47px] top-2 left-[82px]">
              <div className="absolute w-[252px] top-0 left-0 [font-family:'Poppins-Regular',Helvetica] font-normal text-black text-[32px] tracking-[0] leading-[48.0px] whitespace-nowrap">
                Instalasi Kotlin
              </div>
            </div>

            <div className="absolute w-80 h-[22px] top-[74px] left-2 bg-[#36ff3a] rounded-[35px]" />

            <div className="absolute w-[50px] top-[70px] left-[334px] [font-family:'Poppins-Light',Helvetica] font-light text-black text-xl text-center tracking-[0] leading-[30.0px] whitespace-nowrap">
              100%
            </div>
          </div>
        </div>

        <div className="absolute w-[30px] h-[30px] top-[454px] left-[324px]">
          <img
            className="absolute w-[23px] h-[23px] top-1 left-1"
            alt="Vector"
            src={vector}
          />
        </div>
      </div>
    </div>
  );
};
