const nodemailer = require("nodemailer")
const { OAuth2Client } = require("google-auth-library");


const {CLIENT_ID,CLIENT_SECRET,REDIRECT_URI,REFRESH_TOKEN} = process.env

console.log(process.env.CLIENT_ID)


const oAuth2Client = new OAuth2Client(CLIENT_ID,CLIENT_SECRET,REDIRECT_URI)
oAuth2Client.setCredentials({refresh_token: REFRESH_TOKEN})

async function sendEmail ({name, number, service, date}){
    const fecha = new Date(date)
    const hora = fecha.toLocaleTimeString('en-US'); 

    const dia = fecha.getDate()
    const mes = fecha.getMonth() + 1
    const year = fecha.getFullYear()


    try {
        const accesToken = await oAuth2Client.getAccessToken()
        
        const transport = await nodemailer.createTransport({
            service: "gmail",
            auth: {
                type: "OAuth2",
                user: "enanitola3@gmail.com",
                clientId: CLIENT_ID,
                clientSecret: CLIENT_SECRET,
                refreshToken: REFRESH_TOKEN,
                accesToken: accesToken.token
            }
        })

        const mailOptions = {
            from: "enanitola3@gmail.com",
            to: "nutri.laser.clinic@gmail.com",
            subject: `Nueva cita ${name}!`,
            text: "Felicidades!, Un nuevo cliente",
            html: `
                <div>
                    <h2>Felicidades!</h2>
                    <p>Se ha agendado un nuevo cliente, aca los datos:</p>
                    <table>
                        <tr>
                            <th>Nombre</th>
                            <th>Numero telefonico</th>
                            <th>Servicio</th>
                            <th>Fecha</th>
                        </tr>

                        <tr>
                            <td>${name}</td>
                            <td>
                                <a href="https://wa.me/${number}?text=Hola%20${name}!%0A%0AVimos%20que%20agendaste%20una%20cita%20para%20un%20servicio%20de:%20*${service}*%20el%20dia:%20*${dia}%2F${mes}%2F${year}*%20a%20las:%20${hora}%20y%20nos%20gustaria%20que%20confirmes%20tu%20asistencia!%20Sera%20un%20placer%20para%20nosotros%20el%20poder%20asistirte!">${number}</a>
                            </td>
                            <td>${service}</td>
                            <td>${dia}%2F${mes}%2F${year} a las: ${hora}</td>
                        </tr>
                    </table>
                </div>
            `
        }

        const result = await transport.sendMail(mailOptions)
        return result
    } catch (error) {
        return error
    }
}


module.exports= sendEmail