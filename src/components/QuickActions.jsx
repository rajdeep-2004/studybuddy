import React from "react";
import "./QuickActions.css"

function QuickActions() {
    return (
        <div className="card quick-actions">
            <h4>Quick Actions</h4>
            <div className="div">
                <button>Schedule Session</button>
                <button>Upload Resource</button>
                <button>Open Chat</button>
            </div>
        </div>
    );
}

export default QuickActions;
