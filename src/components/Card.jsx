
export default function Card(props) {
    return (
        <div className="card">

            <div className="card-header">
                {props.icon && <div className="card-icon">{props.icon}</div>}
                <h1>{props.heading}</h1>
            </div>

            <p>{props.text}</p>
        </div>
    );
}