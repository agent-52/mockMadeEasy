import App from "./App"
import { ProtectedRoute } from "./components/ProtectedRoute"
import { AppLayout } from "./layouts/AppLayout"
import { AccountSettingsScreen } from "./screens/AccountSettingScreen"
import { AuthScreen } from "./screens/auth"
import { ConfirmationScreen } from "./screens/ConfirmationScreen"
import { Dashboard } from "./screens/Dashboard"
import { ErrorScreen } from "./screens/ErrorScreen"
import { InterviewSessionScreen } from './screens/InterviewSession';
import { InterviewSetup } from "./screens/InterviewSetup"
import { PastSessionsPage } from "./screens/PastSessions"
import { PricingPage } from "./screens/PricingScreen"
import { QuestionReviewScreen } from "./screens/QuestionReviewScreen"
import { SummaryScreen } from "./screens/SummaryScreen"

const routes = [
    {
        path:"/",
        element: <App />,
        errorElement:<ErrorScreen />
    },
    {
        path:"/auth",
        element:<AuthScreen />
    },
    {
        path:"/dashboard",
        element:<ProtectedRoute><AppLayout backgroundColor="bg2" children={<Dashboard />}/></ProtectedRoute>
    },
    {
        path:"/interview/setup",
        element:<AppLayout backgroundColor="bg2" children={<InterviewSetup/>} />
    },
    {
        path:"/interview/confirmation",
        element:<ConfirmationScreen />
    },
    {
        path:"/interview/session/:id",
        element:<ProtectedRoute><InterviewSessionScreen stackLabel="React" interviewType="Frontend" difficulty="Medium" /></ProtectedRoute>
    },
    {
        path:"/interview/:id/summary",
        element: <ProtectedRoute><SummaryScreen /></ProtectedRoute>
    },{
        path:"/interview/:id/review",
        element:<ProtectedRoute><AppLayout backgroundColor="bg1" children={<QuestionReviewScreen />}/></ProtectedRoute>
    },
    {
        path:"/past-sessions",
        element:<ProtectedRoute><AppLayout backgroundColor="bg1" children={<PastSessionsPage />}></AppLayout></ProtectedRoute>
    },
    {
        path:"/account-settings",
        element:<AccountSettingsScreen />
    },
    {
        path:"/pricing",
        element:<PricingPage />
    }
    // {
    //     path: "profile/:name",
    //     element: <Profile />,
    // }
]

export default routes