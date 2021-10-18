import * as React from "react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

/*
    MyoCoach frontend about section component
    =========================================
    Authors: Julien & Kevin Monnier - RE-FACTORY SARL
    Company: ORTHOPUS SAS
    License: Creative Commons Zero v1.0 Universal
    Website: orthopus.com
    Last edited: October 2021
 */
const About: React.FC<any> = () => {
    return(
        <Box mx={2}>
            <Typography variant={"h5"}>
                Welcome on the MyoCoach !
            </Typography>
            <br/>
            <Typography variant={"body1"}>
                We are ORTHOPUS and we developed this training device for upper-limb amputees who want to wear a
                myoelectric prosthetic hand, and to allow healthcare professionals to adjust the myo sensors.
            </Typography>
            <br/>
            <Typography variant={"body1"}>
                &nbsp;●   The <Box component={"strong"} fontFamily={"Montserrat-Bold"}>signal</Box> mode helps you to define the optimal sensor position.
            </Typography>
            <Typography variant={"body1"}>
                &nbsp;●   Then you can practice on the <Box component={"strong"} fontFamily={"Montserrat-Bold"}>training</Box> mode (with several levels), play the <Box component={"strong"} fontFamily={"Montserrat-Bold"}>games</Box> and try to beat the records
            </Typography>
            <Typography variant={"body1"}>
                &nbsp;●   You can follow your progress on the account page by clicking on the octopus
            </Typography>
            <br/>
            <Typography variant={"body1"}>
                We hope you will enjoy it! If you meet any troubles or have ideas to share with us, please let us know: you
                can open an issue on the MyoCoach github repository, or write an email to contact@orthopus.com.
            </Typography>
            <br/>
            <br/>
            <Typography variant={"h5"}>
                ORTHOPUS : handitech solutions for everyone
            </Typography>
            <br/>
            <Typography variant={"body1"}>
                We are a french company founded in 2018 and we want to reduce health inequalities by designing
                quality solutions at fair prices.
            </Typography>
            <Typography variant={"body2"}>
                Our goal is to provide quality medical solutions to the largest possible number of people with
                disabilities in the world.
            </Typography>
            <br/>
            <Typography variant={"body1"}>
                We use our technological expertise to meet users’ needs in the simplest, most effective and
                sustainable way possible.
            </Typography>
            <br/>
            <Typography variant={"body1"}>
                ORTHOPUS develops two ranges of solutions dedicated to upper limb impairments: prostheses for
                transradial amputations and disarticulations of the wrist, and assistive robotic solutions for
                people in wheelchairs with limited mobility.
            </Typography>
            <br/>
            <Typography variant={"subtitle2"}>More info on our website: orthopus.com</Typography>
            <br/>
            <Typography variant={"subtitle1"}>V2.0</Typography>
            <Typography variant={"subtitle1"}>Developed by ORTHOPUS</Typography>
            <Typography variant={"subtitle1"}>Software programmers: Kevin & Julien Monnier, RE-FACTORY</Typography>
        </Box>
    );
}

export default About;