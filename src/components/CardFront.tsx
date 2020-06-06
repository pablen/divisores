import PropTypes from 'prop-types'
import React from 'react'

const CardFront: React.FC<Props> = ({ value, type, ...other }) => (
  <svg
    preserveAspectRatio="xMinYMin"
    data-cardtype={type}
    aria-hidden="true"
    viewBox="0 0 62 88"
    xmlns="http://www.w3.org/2000/svg"
    {...other}
  >
    <defs>
      <g id="figure" width="100" height="100" viewBox="0 0 100 100">
        <path
          fill="#b00"
          stroke="black"
          d="M95.705 52.411c-0.050 5.644-0.889 11.072-2.413 16.206l0.106-0.415c-1.611 5.673-3.943 11.037-7.162 15.996-2.12 3.297-4.542 6.143-7.295 8.631l-0.037 0.033c-3.103 2.755-6.566 4.894-10.56 6.116-2.033 0.649-4.371 1.023-6.797 1.023-0.154 0-0.307-0.002-0.46-0.004l0.023 0c-2.708-0.051-5.641-0.467-8.143-1.494-0.389-0.181-0.844-0.336-1.318-0.442l-0.045-0.008c-0.246-0.038-0.529-0.060-0.818-0.060s-0.572 0.022-0.849 0.064l0.031-0.004c-0.995 0.117-1.974 0.333-2.952 0.548-1.116 0.246-2.162 0.596-3.278 0.804-0.995 0.159-2.142 0.25-3.311 0.25-0.971 0-1.927-0.063-2.864-0.185l0.111 0.012c-4.493-0.567-8.478-2.381-12.126-4.998-3.395-2.436-6.271-5.399-8.8-8.711-3.984-5.216-6.948-10.969-9.114-17.16-0.995-2.711-1.878-5.971-2.49-9.326l-0.057-0.378c-0.348-1.747-0.602-3.822-0.707-5.935l-0.004-0.103c-0.059-1.638-0.117-3.281-0.053-4.917 0.149-3.803 0.824-7.51 2.321-11.033 3.55-8.355 11.536-12.518 20.305-13.212 5.22-0.412 10.473 0.352 15.553 1.621 1.764 0.422 3.229 0.876 4.654 1.412l-0.267-0.088c0.728 0.276 1.445 0.588 2.181 0.842 1.691 0.584 3.283 0.52 5.032 0.427 1.496-0.079 2.513-0.734 3.881-1.352 3.048-1.429 6.588-2.423 10.312-2.79l0.135-0.011c8.775-0.792 17.726 2.483 22.592 10.085 1.766 2.759 2.901 5.778 3.637 8.955 0.475 1.943 0.81 4.219 0.934 6.551l0.004 0.095c0.045 0.985 0.072 1.971 0.11 2.956z"
        />
        <path
          fill="#008000"
          d="M54.115 17.010c-0.032 0.308-0.694 0.312-0.893 0.341-1.070 0.151-2.305 0.237-3.561 0.237-0.914 0-1.817-0.046-2.707-0.135l0.112 0.009c-6.844-0.603-13.342-2.466-19.532-5.426-1.891-0.9-3.69-1.946-5.295-3.3-0.809-0.683-1.562-1.42-2.065-2.377-0.756-1.43-0.365-2.619 0.77-3.557 0.741-0.581 1.603-1.050 2.538-1.361l0.060-0.017c1.668-0.607 3.609-1.054 5.622-1.257l0.103-0.008c0.852-0.101 1.839-0.158 2.839-0.158 0.304 0 0.607 0.005 0.909 0.016l-0.044-0.001c4.283 0.168 8.321 1.214 12.005 3.459 2.247 1.372 4.146 3.067 5.699 5.047l0.034 0.046c1.596 2.063 2.523 4.236 3.33 6.653-3.119-1.653-6.109-3.351-9.416-4.641-2.542-1.026-5.846-2.124-9.221-3.050l-0.703-0.165c-3.183-0.874-6.43-1.657-9.732-1.664 10.065 2.364 20.288 5.106 28.848 10.895 0.12 0.066 0.215 0.165 0.274 0.284l0.002 0.004c0.015 0.034 0.023 0.073 0.023 0.114 0 0.005-0 0.010-0 0.015v-0.001z"
        />
        <path
          fill="#610"
          d="M64.085 5.932q-0.030 0.116-0.068 0.227c-0.45 1.309-2.139 1.734-3.026 2.801-0.085 0.114-0.164 0.243-0.229 0.379l-0.006 0.014c-1.566 2.897-2.841 6.253-3.649 9.787l-0.052 0.27c-0.62 2.672 0.068 7.309-3.444 7.99-0.997 0.189-2.037 0-2.986-0.354-0.142-0.046-0.265-0.115-0.37-0.204l0.002 0.001c-0.125-0.138-0.202-0.322-0.202-0.524 0-0.092 0.016-0.18 0.045-0.262l-0.002 0.005c0.102-0.277 0.245-0.515 0.424-0.722l-0.002 0.003c2.587-3.389 4.295-7.311 5.685-11.338 0.605-1.753 1.49-3.557 1.838-5.378 0.357-1.87 0.157-3.799 0.507-5.673 0.042-0.287 0.128-0.545 0.252-0.781l-0.006 0.013c0.966-1.687 3.521-0.055 4.446 0.756 0.584 0.554 0.947 1.336 0.947 2.203 0 0.279-0.038 0.549-0.108 0.806l0.005-0.021z"
        />
      </g>
    </defs>

    <rect
      x="0"
      y="0"
      width="62"
      height="88"
      rx="4"
      ry="4"
      fill="white"
      stroke="transparent"
      strokeWidth="0"
    />

    <rect
      x="4"
      y="4"
      width="54"
      height="80"
      rx="1.5"
      ry="1.5"
      fill="transparent"
      stroke="silver"
      strokeWidth="0.5"
    />

    <text
      textAnchor={type === 'image' ? 'end' : 'middle'}
      fontFamily="sans-serif"
      fontSize={type === 'image' ? 18 : 28}
      fill="rgb(102, 102, 102)"
      x={type === 'image' ? 55 : 31}
      y={type === 'image' ? 20 : 51}
    >
      {value}
    </text>

    {type === 'image' && (
      <>
        {value === 1 && (
          <g id="value1" transform="translate(23,38)">
            <use
              transform="scale(0.25) translate(-20,-15)"
              xlinkHref="#figure"
            />
          </g>
        )}

        {value === 2 && (
          <g id="value2" transform="translate(25,38)">
            <use
              transform="scale(0.2) translate(-20, -80)"
              xlinkHref="#figure"
            />
            <use
              transform="scale(0.2) translate(-20, 60)"
              xlinkHref="#figure"
            />
          </g>
        )}

        {value === 3 && (
          <g id="value3" transform="translate(25,38)">
            <use
              transform="scale(0.18) translate(-80 -135)"
              xlinkHref="#figure"
            />
            <use
              transform="scale(0.18) translate(-20,-15)"
              xlinkHref="#figure"
            />
            <use
              transform="scale(0.18) translate(40,105)"
              xlinkHref="#figure"
            />
          </g>
        )}

        {value === 4 && (
          <g id="value4" transform="translate(25,38)">
            <use
              transform="scale(0.18) translate(-90, -45)"
              xlinkHref="#figure"
            />
            <use
              transform="scale(0.18) translate(60, -45)"
              xlinkHref="#figure"
            />
            <use
              transform="scale(0.18) translate(-90, 110)"
              xlinkHref="#figure"
            />
            <use
              transform="scale(0.18) translate(60, 110)"
              xlinkHref="#figure"
            />
          </g>
        )}

        {value === 5 && (
          <g id="value5" transform="translate(27,38)">
            <use
              transform="scale(0.13) translate(-85, -25)"
              xlinkHref="#figure"
            />
            <use
              transform="scale(0.13) translate(45,-25)"
              xlinkHref="#figure"
            />

            <use
              transform="scale(0.13) translate(-145, 175)"
              xlinkHref="#figure"
            />
            <use
              transform="scale(0.13) translate(-20, 175)"
              xlinkHref="#figure"
            />
            <use
              transform="scale(0.13) translate(105,175)"
              xlinkHref="#figure"
            />
          </g>
        )}

        {value === 6 && (
          <g id="value6" transform="translate(27,38)">
            <use
              transform="scale(0.13) translate(-145, -25)"
              xlinkHref="#figure"
            />
            <use
              transform="scale(0.13) translate(-20, -25)"
              xlinkHref="#figure"
            />
            <use
              transform="scale(0.13) translate(105,-25)"
              xlinkHref="#figure"
            />

            <use
              transform="scale(0.13) translate(-145, 175)"
              xlinkHref="#figure"
            />
            <use
              transform="scale(0.13) translate(-20, 175)"
              xlinkHref="#figure"
            />
            <use
              transform="scale(0.13) translate(105,175)"
              xlinkHref="#figure"
            />
          </g>
        )}

        {value === 7 && (
          <g id="value7" transform="translate(27,38)">
            <use
              transform="scale(0.13) translate(-145, -225)"
              xlinkHref="#figure"
            />

            <use
              transform="scale(0.13) translate(-145, -25)"
              xlinkHref="#figure"
            />
            <use
              transform="scale(0.13) translate(-20, -25)"
              xlinkHref="#figure"
            />
            <use
              transform="scale(0.13) translate(105,-25)"
              xlinkHref="#figure"
            />

            <use
              transform="scale(0.13) translate(-145, 175)"
              xlinkHref="#figure"
            />
            <use
              transform="scale(0.13) translate(-20, 175)"
              xlinkHref="#figure"
            />
            <use
              transform="scale(0.13) translate(105,175)"
              xlinkHref="#figure"
            />
          </g>
        )}

        {value === 8 && (
          <g id="value8" transform="translate(27,38)">
            <use
              transform="scale(0.12) translate(-150, -120)"
              xlinkHref="#figure"
            />
            <use
              transform="scale(0.12) translate(-20, -120)"
              xlinkHref="#figure"
            />

            <use
              transform="scale(0.12) translate(-150, 50)"
              xlinkHref="#figure"
            />
            <use
              transform="scale(0.12) translate(-20, 50)"
              xlinkHref="#figure"
            />
            <use
              transform="scale(0.12) translate(110,50)"
              xlinkHref="#figure"
            />

            <use
              transform="scale(0.12) translate(-150, 220)"
              xlinkHref="#figure"
            />
            <use
              transform="scale(0.12) translate(-20, 220)"
              xlinkHref="#figure"
            />
            <use
              transform="scale(0.12) translate(110,220)"
              xlinkHref="#figure"
            />
          </g>
        )}

        {value === 9 && (
          <g id="value9" transform="translate(27,38)">
            <use
              transform="scale(0.12) translate(-150, -120)"
              xlinkHref="#figure"
            />
            <use
              transform="scale(0.12) translate(-20, -120)"
              xlinkHref="#figure"
            />
            <use
              transform="scale(0.12) translate(110, -120)"
              xlinkHref="#figure"
            />

            <use
              transform="scale(0.12) translate(-150, 50)"
              xlinkHref="#figure"
            />
            <use
              transform="scale(0.12) translate(-20, 50)"
              xlinkHref="#figure"
            />
            <use
              transform="scale(0.12) translate(110,50)"
              xlinkHref="#figure"
            />

            <use
              transform="scale(0.12) translate(-150, 220)"
              xlinkHref="#figure"
            />
            <use
              transform="scale(0.12) translate(-20, 220)"
              xlinkHref="#figure"
            />
            <use
              transform="scale(0.12) translate(110,220)"
              xlinkHref="#figure"
            />
          </g>
        )}

        {value === 10 && (
          <g id="value10" transform="translate(27,38)">
            <use
              transform="scale(0.12) translate(-150, -245)"
              xlinkHref="#figure"
            />

            <use
              transform="scale(0.12) translate(-150, -90)"
              xlinkHref="#figure"
            />
            <use
              transform="scale(0.12) translate(-20, -90)"
              xlinkHref="#figure"
            />
            <use
              transform="scale(0.12) translate(110, -90)"
              xlinkHref="#figure"
            />

            <use
              transform="scale(0.12) translate(-150, 65)"
              xlinkHref="#figure"
            />
            <use
              transform="scale(0.12) translate(-20, 65)"
              xlinkHref="#figure"
            />
            <use
              transform="scale(0.12) translate(110,65)"
              xlinkHref="#figure"
            />

            <use
              transform="scale(0.12) translate(-150, 220)"
              xlinkHref="#figure"
            />
            <use
              transform="scale(0.12) translate(-20, 220)"
              xlinkHref="#figure"
            />
            <use
              transform="scale(0.12) translate(110,220)"
              xlinkHref="#figure"
            />
          </g>
        )}
      </>
    )}
  </svg>
)

const CardFrontPropTypes = {
  value: PropTypes.number.isRequired,
  type: PropTypes.oneOf<'number' | 'image'>(['number', 'image']),
}

CardFront.propTypes = CardFrontPropTypes

type Props = PropTypes.InferProps<typeof CardFrontPropTypes> &
  React.PropsWithoutRef<JSX.IntrinsicElements['svg']>

export default CardFront
