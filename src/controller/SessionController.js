import {clientsArray, sessions} from "../util/SessionUtil";
import {opendata} from "../util/CreateSessionUtil";
import getAllTokens from "../util/GetAllTokens";

export async function startAllSessions(req, res) {
    const {secretkey} = req.params

    const allSessions = await getAllTokens();

    if (secretkey !== process.env.SECRET_KEY) {
        return res.status(400).json({
            response: false,
            message: 'O token informado está incorreto.'
        })
    }

    allSessions.map(async (session) => {
        await opendata(req, res, session.replace('data.json', ''))
    })

    return await res.status(200).json({status: "Success", message: "Iniciando todas as sessões"})
}

export async function startSession(req, res) {
    const session = req.session;

    await opendata(req, res, session)
}

export async function closeSession(req, res) {
    const session = req.session;

    await clientsArray[session].close();
    sessions.filter(item => item !== session);

    req.io.emit('whatsapp-status', false);
}

export async function showAllSessions(req, res) {
    res.status(200).json(sessions);
}

export async function checkSessionConnected(req, res) {
    const session = req.session;

    try {
        const response = await clientsArray[session].isConnected();
        return res.status(200).json({
            response: response,
            message: 'A sessão está ativa.'
        })

    } catch (error) {
        return res.status(200).json({
            response: false,
            message: 'A sessão não está ativa.'
        })
    }
}