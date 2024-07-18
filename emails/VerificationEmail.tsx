import { Head, Heading, Html, Preview, Row, Section, Text } from "@react-email/components";



interface verificationEmailProps{
    username: string;
    otp: string;
}

export default function VerificationEmail({ username, otp } : verificationEmailProps ) {
    return (
        <Html lang='eng' dir='ltr'>
            <Head>
                <title>Verification Code</title>
            </Head>
            <Preview>Here is the verification code : {otp} </Preview>
            <Section>
                <Row>
                    <Heading as="h2">
                        Hello , {username}
                    </Heading>
                </Row>
                <Row>
                    <Text>
                        Thanks for Registering. Kindly use the code to verify your ID
                    </Text>
                </Row>
                <Row>
                    <Text> {otp} </Text>
                </Row>
                <Row>
                    <Text> If you did not request this code, please ignore this email </Text>
                </Row>
            </Section>
        </Html>
    )   
}
